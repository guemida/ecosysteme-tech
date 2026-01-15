/**
 * Écosystème Technologique IT - Application JavaScript
 * © 2026 Tous droits réservés
 * Version: 1.0.0
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
        searchTerm: ''
    };

    // ========== Utility Functions ==========

    /**
     * Debounce function to limit function calls
     * @param {Function} func - Function to debounce
     * @param {number} delay - Delay in milliseconds
     * @returns {Function} Debounced function
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
     * @param {string} str - String to sanitize
     * @returns {string} Sanitized string
     */
    function sanitizeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Show error message to user
     * @param {string} message - Error message
     * @param {Error} [error] - Optional error object
     */
    function showError(message, error) {
        console.error(message, error);

        const mainContainer = document.querySelector('.main-container');
        if (mainContainer) {
            mainContainer.innerHTML = `
                <div class="error" role="alert">
                    <h2>Une erreur est survenue</h2>
                    <p>${sanitizeHTML(message)}</p>
                    <p style="margin-top: 1rem;">
                        <button onclick="location.reload()" class="filter-btn">
                            Recharger la page
                        </button>
                    </p>
                </div>
            `;
        }
    }

    /**
     * Show loading indicator
     */
    function showLoading() {
        const mainContainer = document.querySelector('.main-container');
        if (mainContainer) {
            mainContainer.innerHTML = `
                <div class="loading" role="status" aria-live="polite">
                    <span>Chargement en cours</span>
                </div>
            `;
        }
    }

    // ========== Data Loading ==========

    /**
     * Load JSON data with error handling
     * @param {string} url - URL to fetch
     * @returns {Promise<Object>} Parsed JSON data
     */
    async function loadJSON(url) {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error(`Impossible de charger ${url}: ${error.message}`);
        }
    }

    /**
     * Load all application data
     * @returns {Promise<void>}
     */
    async function loadData() {
        try {
            showLoading();

            // Load all data in parallel for better performance
            const [techData, techLinks, config] = await Promise.all([
                loadJSON(CONFIG.dataPath),
                loadJSON(CONFIG.linksPath),
                loadJSON(CONFIG.configPath)
            ]);

            // Validate data
            if (!techData || !techData.nodes || !Array.isArray(techData.nodes)) {
                throw new Error('Format de données invalide');
            }

            if (!techLinks || !techLinks.links || !Array.isArray(techLinks.links)) {
                throw new Error('Format de liens invalide');
            }

            // Store in state
            appState.techData = techData;
            appState.techLinks = techLinks;
            appState.config = config;

            return { techData, techLinks, config };
        } catch (error) {
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

            // Count nodes by group
            const groupCounts = {};
            nodes.forEach(node => {
                groupCounts[node.group] = (groupCounts[node.group] || 0) + 1;
            });

            // Create "All" button
            let html = `
                <button
                    class="filter-btn active"
                    data-group="all"
                    aria-label="Afficher toutes les ${nodes.length} technologies"
                    aria-pressed="true">
                    Tout (${nodes.length})
                </button>
            `;

            // Create category buttons
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

            // Add event listeners
            container.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', (e) => setFilter(e.target.dataset.group));
            });

        } catch (error) {
            console.error('Erreur lors du rendu des filtres:', error);
        }
    }

    /**
     * Set filter and update UI
     * @param {string|null} group - Group to filter by
     */
    function setFilter(group) {
        try {
            appState.currentFilter = group === 'all' ? null : group;

            const { groupColors } = appState.config;

            // Update button states
            document.querySelectorAll('.filter-btn').forEach(btn => {
                const btnGroup = btn.dataset.group;
                const isActive = btnGroup === group;

                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-pressed', isActive);

                if (isActive && group !== 'all' && groupColors[group]) {
                    btn.style.background = groupColors[group];
                    btn.style.color = 'white';
                    btn.style.borderColor = groupColors[group];
                } else if (!isActive) {
                    btn.style.background = '';
                    btn.style.color = '';
                    btn.style.borderColor = '';
                }
            });

            renderGraph(appState.searchTerm);
        } catch (error) {
            console.error('Erreur lors de la définition du filtre:', error);
        }
    }

    /**
     * Render the D3 graph
     * @param {string} searchTerm - Search term for filtering
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

            // Update stats
            updateStats(filteredNodes.length, filteredLinks.length);

            // Create graph container
            const graphContainer = svg.append('g');

            // Add zoom behavior
            const zoom = d3.zoom()
                .scaleExtent([0.2, 4])
                .on('zoom', (event) => graphContainer.attr('transform', event.transform));
            svg.call(zoom);

            // Copy node data to avoid mutation
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

            // Create links
            const link = graphContainer.append('g')
                .attr('aria-hidden', 'true')
                .selectAll('line')
                .data(links)
                .join('line')
                .attr('stroke', '#CBD5E1')
                .attr('stroke-opacity', 0.5)
                .attr('stroke-width', d => d.strength * 2);

            // Create node groups
            const node = graphContainer.append('g')
                .selectAll('g')
                .data(nodes)
                .join('g')
                .attr('cursor', 'pointer')
                .attr('role', 'button')
                .attr('tabindex', '0')
                .attr('aria-label', d => `Technologie ${d.id}`)
                .call(d3.drag()
                    .on('start', dragstarted)
                    .on('drag', dragged)
                    .on('end', dragended));

            // Add circles to nodes
            node.append('circle')
                .attr('r', visualDefaults.nodeRadius)
                .attr('fill', d => appState.config.groupColors[d.group])
                .attr('stroke', '#fff')
                .attr('stroke-width', 2.5)
                .attr('opacity', 0.9)
                .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))');

            // Add text labels to nodes
            node.append('text')
                .text(d => d.id.length > 12 ? d.id.substring(0, 10) + '...' : d.id)
                .attr('text-anchor', 'middle')
                .attr('dy', 38)
                .attr('font-size', '10px')
                .attr('font-weight', '600')
                .attr('fill', '#374151')
                .style('pointer-events', 'none')
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

            // Add hover handlers
            node.on('mouseover', (event, d) => {
                d3.select(event.currentTarget).select('circle')
                    .transition().duration(200)
                    .attr('r', 30).attr('stroke-width', 3);
                if (!appState.selectedNode) renderSidebar(d);
            });

            node.on('mouseout', (event) => {
                d3.select(event.currentTarget).select('circle')
                    .transition().duration(200)
                    .attr('r', visualDefaults.nodeRadius).attr('stroke-width', 2.5);
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
            const connectedNodes = new Set([d.id]);

            links.forEach(l => {
                const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
                const targetId = typeof l.target === 'object' ? l.target.id : l.target;
                if (sourceId === d.id) connectedNodes.add(targetId);
                if (targetId === d.id) connectedNodes.add(sourceId);
            });

            node.select('circle').transition().duration(300)
                .attr('opacity', n => connectedNodes.has(n.id) ? 1 : 0.15);

            node.select('text').transition().duration(300)
                .attr('opacity', n => connectedNodes.has(n.id) ? 1 : 0.15);

            link.transition().duration(300)
                .attr('stroke-opacity', l => {
                    const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
                    const targetId = typeof l.target === 'object' ? l.target.id : l.target;
                    return (sourceId === d.id || targetId === d.id) ? 0.9 : 0.05;
                })
                .attr('stroke', l => {
                    const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
                    const targetId = typeof l.target === 'object' ? l.target.id : l.target;
                    return (sourceId === d.id || targetId === d.id) ?
                        appState.config.groupColors[d.group] : '#CBD5E1';
                })
                .attr('stroke-width', l => {
                    const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
                    const targetId = typeof l.target === 'object' ? l.target.id : l.target;
                    return (sourceId === d.id || targetId === d.id) ? 3 : l.strength * 2;
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
            node.select('circle').transition().duration(300).attr('opacity', 0.9);
            node.select('text').transition().duration(300).attr('opacity', 1);
            link.transition().duration(300)
                .attr('stroke-opacity', 0.5)
                .attr('stroke', '#CBD5E1')
                .attr('stroke-width', d => d.strength * 2);
        } catch (error) {
            console.error('Erreur lors de la réinitialisation:', error);
        }
    }

    /**
     * Get connected technologies for a node
     * @param {string} nodeId - Node ID
     * @returns {Array} Connected nodes
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
     * @param {Object|null} node - Node data or null for welcome
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
                // Render welcome screen
                sidebar.innerHTML = `
                    <div class="welcome-box">
                        <div class="icon" aria-hidden="true">👆</div>
                        <h2>Explorez l'écosystème</h2>
                        <p>Cliquez sur une technologie pour voir ses détails et connexions</p>
                    </div>

                    <h3 style="margin-bottom: 12px; color: var(--color-slate-600);">📊 Légende</h3>
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
     * @param {string} id - Node ID
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
     * Update stats display
     * @param {number} nodeCount - Number of nodes
     * @param {number} linkCount - Number of links
     */
    function updateStats(nodeCount, linkCount) {
        try {
            const nodeCountEl = document.getElementById('nodeCount');
            const linkCountEl = document.getElementById('linkCount');

            if (nodeCountEl) nodeCountEl.textContent = nodeCount;
            if (linkCountEl) linkCountEl.textContent = linkCount;
        } catch (error) {
            console.error('Erreur lors de la mise à jour des stats:', error);
        }
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

            // Debounced search handler
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
