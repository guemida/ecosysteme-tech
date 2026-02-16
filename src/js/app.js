/**
 * Écosystème Technologique IT - Application JavaScript
 * © 2026 Tous droits réservés
 * Version: 2.0.0 - Glassmorphism + Dark Mode
 *
 * IMPORTANT: Ce code est protégé par copyright.
 * Toute reproduction non autorisée est interdite.
 */

'use strict';

/**
 * Main Application Module
 * Encapsulated in IIFE to avoid global scope pollution
 */
(function() {
    // ========== Configuration ==========
    const CONFIG = {
        dataPath: './src/data/techdata.json',
        linksPath: './src/data/techlinks.json',
        configPath: './src/data/config.json',
        debounceDelay: 300,
        visualDefaults: {
            nodeRadius: 24,
            nodeHoverRadius: 35,
            linkDistance: 100,
            chargeStrength: -300,
            collisionRadius: 40
        }
    };

    // ========== State Management ==========
    let appState = {
        techData: null,
        techLinks: null,
        config: null,
        currentFilter: null,
        selectedNode: null,
        simulation: null,
        searchTerm: '',
        theme: 'light'
    };

    // ========== Utility Functions ==========

    /**
     * Debounce function to limit function calls
     */
    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    /**
     * Sanitize HTML to prevent XSS attacks
     */
    function sanitizeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Show error message to user
     */
    function showError(message, error) {
        console.error(message, error);

        const existing = document.getElementById('errorOverlay');
        if (existing) existing.remove();

        const graphContainer = document.querySelector('.graph-container');
        if (graphContainer) {
            const errorDiv = document.createElement('div');
            errorDiv.id = 'errorOverlay';
            errorDiv.className = 'error';
            errorDiv.setAttribute('role', 'alert');
            errorDiv.innerHTML = `
                <h2>Une erreur est survenue</h2>
                <p>${sanitizeHTML(message)}</p>
                <p style="margin-top: 1rem;">
                    <button onclick="location.reload()" class="filter-btn">
                        Recharger la page
                    </button>
                </p>
            `;
            graphContainer.appendChild(errorDiv);
        }
    }

    /**
     * Show loading indicator with spinner
     */
    function showLoading() {
        const graphContainer = document.querySelector('.graph-container');
        if (graphContainer) {
            const loader = document.createElement('div');
            loader.className = 'loading';
            loader.id = 'loadingOverlay';
            loader.setAttribute('role', 'status');
            loader.setAttribute('aria-live', 'polite');
            loader.innerHTML = '<div class="loading-spinner"></div><span>Chargement en cours</span>';
            graphContainer.appendChild(loader);
        }
    }

    /**
     * Hide loading indicator
     */
    function hideLoading() {
        const loader = document.getElementById('loadingOverlay');
        if (loader) loader.remove();
    }

    // ========== Theme Management ==========

    /**
     * Initialize theme from localStorage or system preference
     */
    function initializeTheme() {
        const saved = localStorage.getItem('theme');
        if (saved) {
            appState.theme = saved;
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            appState.theme = 'dark';
        }
        applyTheme(appState.theme);

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                appState.theme = e.matches ? 'dark' : 'light';
                applyTheme(appState.theme);
            }
        });
    }

    /**
     * Apply theme to document
     */
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        appState.theme = theme;

        // Update meta theme-color
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.setAttribute('content', theme === 'dark' ? '#0f172a' : '#3B82F6');
        }
    }

    /**
     * Toggle between light and dark themes
     */
    function toggleTheme() {
        const newTheme = appState.theme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);

        // Re-render graph for theme-aware colors
        if (appState.techData) {
            renderGraph(appState.searchTerm);
        }
    }

    /**
     * Initialize theme toggle button
     */
    function initializeThemeToggle() {
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', toggleTheme);
        }
    }

    // ========== Data Loading ==========

    /**
     * Load JSON data with error handling
     */
    async function loadJSON(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            throw new Error(`Impossible de charger ${url}: ${error.message}`);
        }
    }

    /**
     * Load all application data
     */
    async function loadData() {
        try {
            showLoading();

            let techData, techLinks, config;

            if (window.__ECOSYSTEM_DATA__) {
                techData = window.__ECOSYSTEM_DATA__.techData;
                techLinks = window.__ECOSYSTEM_DATA__.techLinks;
                config = window.__ECOSYSTEM_DATA__.config;
            } else {
                [techData, techLinks, config] = await Promise.all([
                    loadJSON(CONFIG.dataPath),
                    loadJSON(CONFIG.linksPath),
                    loadJSON(CONFIG.configPath)
                ]);
            }

            if (!techData || !techData.nodes || !Array.isArray(techData.nodes)) {
                throw new Error('Format de données invalide');
            }

            if (!techLinks || !techLinks.links || !Array.isArray(techLinks.links)) {
                throw new Error('Format de liens invalide');
            }

            appState.techData = techData;
            appState.techLinks = techLinks;
            appState.config = config;

            hideLoading();
            return { techData, techLinks, config };
        } catch (error) {
            hideLoading();
            showError('Erreur lors du chargement des données', error);
            throw error;
        }
    }

    // ========== Rendering Functions ==========

    /**
     * Render filter buttons
     */
    function renderFilters() {
        try {
            const container = document.getElementById('filterButtons');
            if (!container) {
                throw new Error('Container filterButtons introuvable');
            }

            const { nodes } = appState.techData;
            const { groupLabels, groupIcons, groupColors } = appState.config;

            const groupCounts = {};
            nodes.forEach(node => {
                groupCounts[node.group] = (groupCounts[node.group] || 0) + 1;
            });

            let html = `
                <button
                    class="filter-btn active"
                    data-group="all"
                    aria-label="Afficher toutes les ${nodes.length} technologies"
                    aria-pressed="true">
                    Tout (${nodes.length})
                </button>
            `;

            Object.entries(groupLabels).forEach(([key, label]) => {
                const count = groupCounts[key] || 0;
                if (count > 0) {
                    html += `
                        <button
                            class="filter-btn"
                            data-group="${sanitizeHTML(key)}"
                            aria-label="Filtrer par ${sanitizeHTML(label)} - ${count} technologies"
                            aria-pressed="false">
                            ${groupIcons[key]} ${sanitizeHTML(label)} (${count})
                        </button>
                    `;
                }
            });

            container.innerHTML = html;

            // Add event listeners with ripple effect
            container.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    createRipple(e);
                    setFilter(e.target.closest('.filter-btn').dataset.group);
                });
            });

        } catch (error) {
            console.error('Erreur lors du rendu des filtres:', error);
        }
    }

    /**
     * Create ripple effect on button click
     */
    function createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.className = 'ripple';
        button.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
    }

    /**
     * Set filter and update UI
     */
    function setFilter(group) {
        try {
            appState.currentFilter = group === 'all' ? null : group;

            const { groupColors } = appState.config;

            document.querySelectorAll('.filter-btn').forEach(btn => {
                const btnGroup = btn.dataset.group;
                const isActive = btnGroup === group;

                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-pressed', isActive);

                if (isActive && group !== 'all' && groupColors[group]) {
                    btn.style.background = groupColors[group];
                    btn.style.color = 'white';
                    btn.style.borderColor = 'transparent';
                    btn.style.boxShadow = `0 4px 15px ${groupColors[group]}50`;
                } else if (!isActive) {
                    btn.style.background = '';
                    btn.style.color = '';
                    btn.style.borderColor = '';
                    btn.style.boxShadow = '';
                }
            });

            renderGraph(appState.searchTerm);
        } catch (error) {
            console.error('Erreur lors de la définition du filtre:', error);
        }
    }

    /**
     * Helper: lighten a hex color
     */
    function lightenColor(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.min(255, (num >> 16) + Math.round(255 * percent / 100));
        const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.round(255 * percent / 100));
        const b = Math.min(255, (num & 0x0000FF) + Math.round(255 * percent / 100));
        return `rgb(${r},${g},${b})`;
    }

    /**
     * Render the D3 graph with enhanced visuals
     */
    function renderGraph(searchTerm = '') {
        try {
            const svg = d3.select('#graph');
            svg.selectAll('*').remove();

            const container = svg.node();
            if (!container) {
                throw new Error('SVG container introuvable');
            }

            const rect = container.getBoundingClientRect();
            const width = rect.width || 900;
            const height = rect.height || 600;
            const isDark = appState.theme === 'dark';

            // Filter nodes
            const filteredNodes = appState.techData.nodes.filter(node => {
                const matchesGroup = !appState.currentFilter || node.group === appState.currentFilter;
                const matchesSearch = !searchTerm ||
                    node.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    node.shortDesc.toLowerCase().includes(searchTerm.toLowerCase());
                return matchesGroup && matchesSearch;
            });

            // Filter links
            const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
            const filteredLinks = appState.techLinks.links.filter(link =>
                filteredNodeIds.has(link.source.id || link.source) &&
                filteredNodeIds.has(link.target.id || link.target)
            );

            // Update stats with animation
            animateStats(filteredNodes.length, filteredLinks.length);

            // Create defs for gradients and filters
            const defs = svg.append('defs');

            // Create glow filter
            const glowFilter = defs.append('filter')
                .attr('id', 'glow')
                .attr('x', '-50%')
                .attr('y', '-50%')
                .attr('width', '200%')
                .attr('height', '200%');
            glowFilter.append('feGaussianBlur')
                .attr('stdDeviation', '3')
                .attr('result', 'coloredBlur');
            const glowMerge = glowFilter.append('feMerge');
            glowMerge.append('feMergeNode').attr('in', 'coloredBlur');
            glowMerge.append('feMergeNode').attr('in', 'SourceGraphic');

            // Node shadow filter
            const shadowFilter = defs.append('filter')
                .attr('id', 'nodeShadow')
                .attr('x', '-30%')
                .attr('y', '-30%')
                .attr('width', '160%')
                .attr('height', '160%');
            shadowFilter.append('feDropShadow')
                .attr('dx', '0')
                .attr('dy', '2')
                .attr('stdDeviation', '3')
                .attr('flood-opacity', '0.2');

            // Create radial gradients for each group
            const { groupColors } = appState.config;
            Object.entries(groupColors).forEach(([group, color]) => {
                const gradient = defs.append('radialGradient')
                    .attr('id', `gradient-${group}`)
                    .attr('cx', '35%')
                    .attr('cy', '35%')
                    .attr('r', '65%');
                gradient.append('stop')
                    .attr('offset', '0%')
                    .attr('stop-color', lightenColor(color, 30));
                gradient.append('stop')
                    .attr('offset', '100%')
                    .attr('stop-color', color);
            });

            // Create graph container
            const graphContainer = svg.append('g');

            // Add zoom behavior
            const zoom = d3.zoom()
                .scaleExtent([0.2, 4])
                .on('zoom', (event) => graphContainer.attr('transform', event.transform));
            svg.call(zoom);

            // Copy node data
            const nodes = filteredNodes.map(d => ({...d}));
            const links = filteredLinks.map(d => ({
                source: typeof d.source === 'object' ? d.source.id : d.source,
                target: typeof d.target === 'object' ? d.target.id : d.target,
                strength: d.strength
            }));

            // Create force simulation
            const { visualDefaults } = CONFIG;
            appState.simulation = d3.forceSimulation(nodes)
                .force('link', d3.forceLink(links)
                    .id(d => d.id)
                    .distance(visualDefaults.linkDistance)
                    .strength(d => d.strength * 0.3))
                .force('charge', d3.forceManyBody().strength(visualDefaults.chargeStrength))
                .force('center', d3.forceCenter(width / 2, height / 2))
                .force('collision', d3.forceCollide().radius(visualDefaults.collisionRadius));

            // Create links with group-based colors
            const link = graphContainer.append('g')
                .attr('aria-hidden', 'true')
                .selectAll('line')
                .data(links)
                .join('line')
                .attr('stroke', d => {
                    const sourceNode = nodes.find(n => n.id === (typeof d.source === 'object' ? d.source.id : d.source));
                    return sourceNode ? groupColors[sourceNode.group] : (isDark ? 'rgba(148,163,184,0.4)' : '#CBD5E1');
                })
                .attr('stroke-opacity', 0.25)
                .attr('stroke-width', d => Math.max(1, d.strength * 1.5));

            // Create node groups
            const node = graphContainer.append('g')
                .selectAll('g')
                .data(nodes)
                .join('g')
                .attr('cursor', 'pointer')
                .attr('role', 'button')
                .attr('tabindex', '0')
                .attr('aria-label', d => `Technologie ${d.id}`)
                .style('opacity', 0)
                .call(d3.drag()
                    .on('start', dragstarted)
                    .on('drag', dragged)
                    .on('end', dragended));

            // Fade-in animation for nodes
            node.transition()
                .delay((d, i) => i * 15)
                .duration(500)
                .style('opacity', 1);

            // Add circles with radial gradient
            node.append('circle')
                .attr('r', visualDefaults.nodeRadius)
                .attr('fill', d => `url(#gradient-${d.group})`)
                .attr('stroke', isDark ? 'rgba(255,255,255,0.2)' : '#fff')
                .attr('stroke-width', 2.5)
                .style('filter', 'url(#nodeShadow)');

            // Add text labels with background for readability
            node.append('text')
                .text(d => d.id.length > 12 ? d.id.substring(0, 10) + '...' : d.id)
                .attr('text-anchor', 'middle')
                .attr('dy', 38)
                .attr('font-size', '10px')
                .attr('font-weight', '600')
                .attr('fill', isDark ? '#e2e8f0' : '#374151')
                .style('pointer-events', 'none')
                .style('paint-order', 'stroke')
                .style('stroke', isDark ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.85)')
                .style('stroke-width', '3px')
                .style('stroke-linecap', 'round')
                .style('stroke-linejoin', 'round')
                .attr('aria-hidden', 'true');

            // Add click handlers
            node.on('click', (event, d) => {
                event.stopPropagation();
                appState.selectedNode = appState.selectedNode?.id === d.id ? null : d;
                highlightConnections(d, link, node, links);
                renderSidebar(d);
            });

            // Add keyboard handlers
            node.on('keypress', (event, d) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    appState.selectedNode = appState.selectedNode?.id === d.id ? null : d;
                    highlightConnections(d, link, node, links);
                    renderSidebar(d);
                }
            });

            // Enhanced hover handlers
            node.on('mouseover', (event, d) => {
                const circle = d3.select(event.currentTarget).select('circle');
                circle.transition().duration(200)
                    .attr('r', visualDefaults.nodeHoverRadius)
                    .attr('stroke-width', 3)
                    .style('filter', `url(#glow) drop-shadow(0 0 8px ${groupColors[d.group]})`);
                if (!appState.selectedNode) renderSidebar(d);
            });

            node.on('mouseout', (event) => {
                const circle = d3.select(event.currentTarget).select('circle');
                circle.transition().duration(200)
                    .attr('r', visualDefaults.nodeRadius)
                    .attr('stroke-width', 2.5)
                    .style('filter', 'url(#nodeShadow)');
                if (!appState.selectedNode) renderSidebar(null);
            });

            // Clear selection on background click
            svg.on('click', () => {
                appState.selectedNode = null;
                resetHighlight(link, node);
                renderSidebar(null);
            });

            // Update positions on tick
            appState.simulation.on('tick', () => {
                link
                    .attr('x1', d => d.source.x)
                    .attr('y1', d => d.source.y)
                    .attr('x2', d => d.target.x)
                    .attr('y2', d => d.target.y);
                node.attr('transform', d => `translate(${d.x},${d.y})`);
            });

            // Drag functions
            function dragstarted(event, d) {
                if (!event.active) appState.simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(event, d) {
                d.fx = event.x;
                d.fy = event.y;
            }

            function dragended(event, d) {
                if (!event.active) appState.simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }

        } catch (error) {
            console.error('Erreur lors du rendu du graphe:', error);
            showError('Impossible d\'afficher le graphe', error);
        }
    }

    /**
     * Highlight connections for a node
     */
    function highlightConnections(d, link, node, links) {
        try {
            const { groupColors } = appState.config;
            const connectedNodes = new Set([d.id]);

            links.forEach(l => {
                const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
                const targetId = typeof l.target === 'object' ? l.target.id : l.target;
                if (sourceId === d.id) connectedNodes.add(targetId);
                if (targetId === d.id) connectedNodes.add(sourceId);
            });

            node.select('circle').transition().duration(300)
                .style('opacity', n => connectedNodes.has(n.id) ? 1 : 0.15)
                .style('filter', n => n.id === d.id
                    ? `url(#glow) drop-shadow(0 0 10px ${groupColors[d.group]})`
                    : 'url(#nodeShadow)');

            node.select('text').transition().duration(300)
                .style('opacity', n => connectedNodes.has(n.id) ? 1 : 0.15);

            link.transition().duration(300)
                .attr('stroke-opacity', l => {
                    const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
                    const targetId = typeof l.target === 'object' ? l.target.id : l.target;
                    return (sourceId === d.id || targetId === d.id) ? 0.8 : 0.05;
                })
                .attr('stroke', l => {
                    const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
                    const targetId = typeof l.target === 'object' ? l.target.id : l.target;
                    return (sourceId === d.id || targetId === d.id) ?
                        groupColors[d.group] : (appState.theme === 'dark' ? 'rgba(148,163,184,0.4)' : '#CBD5E1');
                })
                .attr('stroke-width', l => {
                    const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
                    const targetId = typeof l.target === 'object' ? l.target.id : l.target;
                    return (sourceId === d.id || targetId === d.id) ? 3 : Math.max(1, l.strength * 1.5);
                });
        } catch (error) {
            console.error('Erreur lors de la mise en évidence:', error);
        }
    }

    /**
     * Reset highlight
     */
    function resetHighlight(link, node) {
        try {
            const isDark = appState.theme === 'dark';
            const { groupColors } = appState.config;

            node.select('circle').transition().duration(300)
                .style('opacity', 1)
                .style('filter', 'url(#nodeShadow)');
            node.select('text').transition().duration(300)
                .style('opacity', 1);
            link.transition().duration(300)
                .attr('stroke-opacity', 0.25)
                .attr('stroke', d => {
                    const nodes = appState.techData.nodes;
                    const sourceId = typeof d.source === 'object' ? d.source.id : d.source;
                    const sourceNode = nodes.find(n => n.id === sourceId);
                    return sourceNode ? groupColors[sourceNode.group] : (isDark ? 'rgba(148,163,184,0.4)' : '#CBD5E1');
                })
                .attr('stroke-width', d => Math.max(1, d.strength * 1.5));
        } catch (error) {
            console.error('Erreur lors de la réinitialisation:', error);
        }
    }

    /**
     * Get connected technologies for a node
     */
    function getConnectedTechnologies(nodeId) {
        try {
            return appState.techLinks.links
                .filter(l => {
                    const sourceId = l.source.id || l.source;
                    const targetId = l.target.id || l.target;
                    return sourceId === nodeId || targetId === nodeId;
                })
                .map(l => {
                    const sourceId = l.source.id || l.source;
                    const targetId = l.target.id || l.target;
                    const connectedId = sourceId === nodeId ? targetId : sourceId;
                    return appState.techData.nodes.find(n => n.id === connectedId);
                })
                .filter(Boolean);
        } catch (error) {
            console.error('Erreur lors de la récupération des technologies connectées:', error);
            return [];
        }
    }

    /**
     * Render sidebar content
     */
    function renderSidebar(node) {
        try {
            const sidebar = document.getElementById('sidebar');
            if (!sidebar) return;

            const { groupColors, groupLabels, groupIcons } = appState.config;

            if (node) {
                const connected = getConnectedTechnologies(node.id);

                sidebar.innerHTML = `
                    <div class="node-header">
                        <div class="node-icon" style="background: ${groupColors[node.group]}" aria-hidden="true">
                            ${groupIcons[node.group]}
                        </div>
                        <div>
                            <span class="category-badge" style="background: ${groupColors[node.group]}">
                                ${sanitizeHTML(groupLabels[node.group])}
                            </span>
                            <h2 class="node-title">${sanitizeHTML(node.id)}</h2>
                            <p class="node-subtitle">${sanitizeHTML(node.shortDesc)}</p>
                        </div>
                    </div>

                    <div class="description-box">
                        <h3>📖 Description</h3>
                        <p>${sanitizeHTML(node.fullDesc)}</p>
                    </div>

                    <div class="meta-grid">
                        <div class="meta-item blue">
                            <div class="meta-label">Difficulté</div>
                            <div class="meta-value">${sanitizeHTML(node.difficulty)}</div>
                        </div>
                        <div class="meta-item green">
                            <div class="meta-label">Apprentissage</div>
                            <div class="meta-value">${sanitizeHTML(node.learnTime)}</div>
                        </div>
                    </div>
                    <div class="meta-item purple" style="margin-bottom: 12px;">
                        <div class="meta-label">Part de marché</div>
                        <div class="meta-value">${sanitizeHTML(node.marketShare)}</div>
                    </div>

                    <div class="tags-section" style="margin-bottom: 16px;">
                        <h3>🎯 Cas d'usage</h3>
                        <div class="tags-container" role="list">
                            ${node.useCases.map(u =>
                                `<span class="tag" role="listitem">${sanitizeHTML(u)}</span>`
                            ).join('')}
                        </div>
                    </div>

                    <div class="tags-section">
                        <h3>🔗 Connecté à (${connected.length})</h3>
                        <div class="tags-container" role="list">
                            ${connected.map(t =>
                                `<button
                                    class="tag clickable"
                                    style="background: ${groupColors[t.group]}"
                                    onclick="window.ecosystemApp.selectNodeById('${sanitizeHTML(t.id)}')"
                                    aria-label="Explorer ${sanitizeHTML(t.id)}">
                                    ${sanitizeHTML(t.id)}
                                </button>`
                            ).join('')}
                        </div>
                    </div>
                `;
            } else {
                sidebar.innerHTML = `
                    <div class="welcome-box">
                        <div class="icon" aria-hidden="true">👆</div>
                        <h2>Explorez l'écosystème</h2>
                        <p>Cliquez sur une technologie pour voir ses détails et connexions</p>
                    </div>

                    <h3 style="margin-bottom: 12px; color: var(--text-secondary);">📊 Légende</h3>
                    <div class="legend-grid" role="list">
                        ${Object.entries(groupLabels).map(([key, label]) => {
                            const count = appState.techData.nodes.filter(n => n.group === key).length;
                            if (count > 0) {
                                return `
                                    <button
                                        class="legend-item"
                                        onclick="window.ecosystemApp.setFilter('${key}')"
                                        aria-label="Filtrer par ${sanitizeHTML(label)}"
                                        role="listitem">
                                        <div class="legend-dot" style="background: ${groupColors[key]}" aria-hidden="true"></div>
                                        <span class="legend-label">${groupIcons[key]} ${sanitizeHTML(label)}</span>
                                    </button>
                                `;
                            }
                            return '';
                        }).join('')}
                    </div>

                    <div class="tips-box">
                        <h3>💡 Astuces</h3>
                        <ul role="list">
                            <li role="listitem">• Filtrez par catégorie avec les boutons</li>
                            <li role="listitem">• Utilisez la recherche pour trouver une techno</li>
                            <li role="listitem">• Cliquez sur les tags pour naviguer</li>
                            <li role="listitem">• Zoomez avec la molette</li>
                            <li role="listitem">• Basculez en mode sombre avec 🌙</li>
                        </ul>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Erreur lors du rendu de la sidebar:', error);
        }
    }

    /**
     * Select node by ID (public method)
     */
    function selectNodeById(id) {
        try {
            if (typeof id !== 'string' || !id.trim()) {
                console.error('ID de nœud invalide');
                return;
            }

            const node = appState.techData.nodes.find(n => n.id === id);
            if (node) {
                appState.selectedNode = node;
                renderSidebar(node);
                renderGraph(appState.searchTerm);
            }
        } catch (error) {
            console.error('Erreur lors de la sélection du nœud:', error);
        }
    }

    /**
     * Animate stats update with counter effect
     */
    function animateStats(nodeCount, linkCount) {
        try {
            const nodeCountEl = document.getElementById('nodeCount');
            const linkCountEl = document.getElementById('linkCount');

            if (nodeCountEl) {
                const oldValue = parseInt(nodeCountEl.textContent) || 0;
                if (oldValue !== nodeCount) {
                    nodeCountEl.classList.add('animating');
                    animateValue(nodeCountEl, oldValue, nodeCount, 400);
                    setTimeout(() => nodeCountEl.classList.remove('animating'), 400);
                }
            }

            if (linkCountEl) {
                const oldValue = parseInt(linkCountEl.textContent) || 0;
                if (oldValue !== linkCount) {
                    linkCountEl.classList.add('animating');
                    animateValue(linkCountEl, oldValue, linkCount, 400);
                    setTimeout(() => linkCountEl.classList.remove('animating'), 400);
                }
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour des stats:', error);
        }
    }

    /**
     * Animate a numeric value change
     */
    function animateValue(element, start, end, duration) {
        const startTime = performance.now();
        const diff = end - start;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quad
            const eased = 1 - (1 - progress) * (1 - progress);
            const current = Math.round(start + diff * eased);
            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    /**
     * Initialize search functionality
     */
    function initializeSearch() {
        try {
            const searchInput = document.getElementById('searchInput');
            if (!searchInput) {
                throw new Error('Input de recherche introuvable');
            }

            const debouncedSearch = debounce((value) => {
                appState.searchTerm = value;
                renderGraph(value);
            }, CONFIG.debounceDelay);

            searchInput.addEventListener('input', (e) => {
                debouncedSearch(e.target.value);
            });
        } catch (error) {
            console.error('Erreur lors de l\'initialisation de la recherche:', error);
        }
    }

    /**
     * Initialize resize handler
     */
    function initializeResize() {
        const debouncedResize = debounce(() => {
            renderGraph(appState.searchTerm);
        }, 250);

        window.addEventListener('resize', debouncedResize);
    }

    /**
     * Initialize application
     */
    async function init() {
        try {
            // Initialize theme first (before any rendering)
            initializeTheme();
            initializeThemeToggle();

            // Check D3.js availability
            if (typeof d3 === 'undefined') {
                showError('La bibliothèque D3.js n\'a pas pu être chargée. Vérifiez votre connexion internet.');
                return;
            }

            // Load data
            await loadData();

            // Render components
            renderFilters();
            renderGraph();
            renderSidebar();

            // Initialize interactions
            initializeSearch();
            initializeResize();

            console.log('✅ Application initialisée avec succès');
        } catch (error) {
            console.error('❌ Erreur d\'initialisation:', error);
            showError('Impossible de démarrer l\'application', error);
        }
    }

    // ========== Public API ==========
    window.ecosystemApp = {
        init,
        selectNodeById,
        setFilter
    };

    // ========== Auto-initialize on load ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
