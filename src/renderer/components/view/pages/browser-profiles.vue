<template>
    <div class="browser-profiles">
        <!-- Top Toolbar -->
        <div class="toolbar">
            <div class="toolbar-left">
                <button class="btn-add" @click="addNewSession">
                    <i class="fa fa-plus" /> Add
                </button>
                <span class="stats-text">
                    Added {{ sessions.length }} / Total {{ sessions.length }} Times 0 / Total 0
                </span>
                <button class="btn-subscribe">Subscribe</button>
            </div>
            <div class="toolbar-center">
                <select class="filter-select">
                    <option>Filter by user name</option>
                </select>
                <select class="filter-select">
                    <option>Name: Contains</option>
                </select>
                <input type="text" class="filter-input" placeholder="Fill in" />
            </div>
            <div class="toolbar-right">
                <button class="icon-btn" title="Search">
                    <i class="fa fa-search" />
                </button>
                <button class="btn-advanced">Advanced</button>
            </div>
        </div>

        <!-- Left Sidebar Tabs -->
        <div class="sidebar-tabs">
            <button
                v-for="tab in sidebarTabs"
                :key="tab.id"
                class="sidebar-tab"
                :class="{ active: activeSidebarTab === tab.id }"
                @click="activeSidebarTab = tab.id"
            >
                {{ tab.label }}
                <span v-if="tab.count !== undefined" class="tab-count">({{ tab.count }})</span>
            </button>
            <button class="sidebar-tab filter-icon" title="Filter">
                <i class="fa fa-filter" />
            </button>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
            <button class="icon-btn" title="Grid View">
                <i class="fa fa-th" />
            </button>
            <button class="icon-btn" title="Save">
                <i class="fa fa-download" />
            </button>
            <button class="icon-btn" title="Share">
                <i class="fa fa-share" />
            </button>
            <button class="icon-btn" title="List View">
                <i class="fa fa-list" />
            </button>
            <button class="icon-btn" title="Delete" @click="deleteSelected">
                <i class="fa fa-trash" />
            </button>
            <button class="icon-btn" title="More">
                <i class="fa fa-ellipsis-v" />
            </button>
            <button class="icon-btn" title="Refresh" @click="refresh">
                <i class="fa fa-refresh" />
            </button>
        </div>

        <!-- Table -->
        <div class="table-container">
            <table class="profiles-table">
                <thead>
                    <tr>
                        <th class="col-checkbox">
                            <input
                                type="checkbox"
                                :checked="allSelected"
                                @change="toggleSelectAll"
                            />
                        </th>
                        <th class="col-seq sortable" @click="sortBy('seq')">
                            Seq
                            <i class="fa" :class="getSortIcon('seq')" />
                        </th>
                        <th class="col-group">Group</th>
                        <th class="col-name sortable" @click="sortBy('name')">
                            Name
                            <i class="fa" :class="getSortIcon('name')" />
                        </th>
                        <th class="col-platform">Platform</th>
                        <th class="col-proxy">Proxy IP</th>
                        <th class="col-remark">Remark</th>
                        <th class="col-created sortable" @click="sortBy('created')">
                            Created Time
                            <i class="fa" :class="getSortIcon('created')" />
                            <i class="fa fa-info-circle info-icon" />
                        </th>
                        <th class="col-config">Config</th>
                        <th class="col-open sortable" @click="sortBy('opened')">
                            Open
                            <i class="fa" :class="getSortIcon('opened')" />
                        </th>
                        <th class="col-fav">Fav</th>
                        <th class="col-delete">Delete</th>
                    </tr>
                </thead>
                <tbody v-if="sessions.length > 0">
                    <tr
                        v-for="item in sortedSessions"
                        :key="item.session.id"
                        :class="{ active: item.index === currentSessionIndex, selected: selectedSessions.includes(item.index) }"
                    >
                        <td class="col-checkbox">
                            <input
                                type="checkbox"
                                :checked="selectedSessions.includes(item.index)"
                                @change="toggleSelect(item.index)"
                            />
                        </td>
                        <td class="col-seq">{{ item.index + 1 }}</td>
                        <td class="col-group">Ungrouped</td>
                        <td class="col-name">
                            <div class="name-cell">
                                <i class="fa fa-globe" />
                                <input
                                    type="text"
                                    class="name-input"
                                    :value="item.session.name || getSessionName(item.session, item.index)"
                                    @blur="updateSessionName(item.index, $event)"
                                    @keyup.enter="updateSessionName(item.index, $event)"
                                    @keyup.esc="cancelNameEdit($event)"
                                />
                            </div>
                        </td>
                        <td class="col-platform">
                            <div class="platform-cell">
                                <i class="fa fa-globe" />
                                <span>{{ getPlatform(item.session) }}</span>
                            </div>
                        </td>
                        <td class="col-proxy">
                            <div class="proxy-cell">
                                <span class="proxy-icon">直</span>
                                <span v-if="getProxyIP(item.session)" class="proxy-ip">
                                    {{ getProxyIP(item.session) }}
                                </span>
                            </div>
                        </td>
                        <td class="col-remark">
                            <input
                                type="text"
                                class="remark-input"
                                placeholder="Add remark"
                                :value="getRemark(item.session)"
                                @blur="updateRemark(item.index, $event)"
                            />
                        </td>
                        <td class="col-created">
                            <div class="created-cell">
                                <span>{{ getCreatedTime(item.session, item.index) }}</span>
                                <i class="fa fa-info-circle" />
                            </div>
                        </td>
                        <td class="col-config">
                            <button class="config-btn" @click="openConfigPanel(item.index)" title="Configure Profile">
                                <i class="fa fa-windows" />
                            </button>
                        </td>
                        <td class="col-open">
                            <div class="open-cell">
                                <button class="btn-open" @click="openSession(item.index)">
                                    Open
                                </button>
                                <div class="open-time">{{ getLastOpened(item.session, item.index) }}</div>
                                <button class="open-menu" @click.stop="showOpenMenu(item.index)">
                                    <i class="fa fa-ellipsis-v" />
                                </button>
                            </div>
                        </td>
                        <td class="col-fav">
                            <button
                                class="fav-btn"
                                :class="{ active: isFavorite(item.index) }"
                                @click="toggleFavorite(item.index)"
                            >
                                <i class="fa" :class="isFavorite(item.index) ? 'fa-star' : 'fa-star-o'" />
                            </button>
                        </td>
                        <td class="col-delete">
                            <button
                                class="delete-btn"
                                @click="deleteSession(item.index)"
                                title="Delete Session"
                            >
                                <i class="fa fa-trash" />
                            </button>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr class="empty-row">
                        <td colspan="12" class="empty-state">
                            <div class="empty-state-content">
                                <i class="fa fa-globe" />
                                <p>No browser sessions yet</p>
                                <button class="btn-add" @click="addNewSession">
                                    <i class="fa fa-plus" /> Create Your First Session
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div class="pagination" v-if="sessions.length > 0">
            <div class="pagination-left">
                <span>{{ sessions.length }} Records</span>
                <select class="records-select">
                    <option>10 Records/Page</option>
                    <option>20 Records/Page</option>
                    <option>50 Records/Page</option>
                </select>
            </div>
            <div class="pagination-right">
                <button class="page-btn" :disabled="currentPage === 1" @click="currentPage = 1">
                    <i class="fa fa-angle-double-left" />
                </button>
                <button
                    class="page-btn"
                    :disabled="currentPage === 1"
                    @click="currentPage--"
                >
                    <i class="fa fa-angle-left" />
                </button>
                <button
                    v-for="page in totalPages"
                    :key="page"
                    class="page-btn"
                    :class="{ active: page === currentPage }"
                    @click="currentPage = page"
                >
                    {{ page }}
                </button>
                <button
                    class="page-btn"
                    :disabled="currentPage === totalPages"
                    @click="currentPage++"
                >
                    <i class="fa fa-angle-right" />
                </button>
                <button
                    class="page-btn"
                    :disabled="currentPage === totalPages"
                    @click="currentPage = totalPages"
                >
                    <i class="fa fa-angle-double-right" />
                </button>
                <div class="goto-page">
                    <input
                        type="number"
                        v-model.number="gotoPage"
                        min="1"
                        :max="totalPages"
                        class="goto-input"
                    />
                    <span>Page</span>
                </div>
            </div>
        </div>

        <!-- Config Panel (Sliding from right) -->
        <div v-if="showConfigPanel" class="config-panel-overlay" @click="closeConfigPanel">
            <div class="config-panel" :data-theme="theme" @click.stop>
                <div class="config-panel-header">
                    <div class="panel-title">
                        <h3>Update Profile (Seq: {{ selectedConfigIndex !== null ? selectedConfigIndex + 1 : '' }})</h3>
                        <a href="#" class="copy-id-link" @click.prevent="copySessionId">Copy ID</a>
                    </div>
                    <button class="panel-close" @click="closeConfigPanel">
                        <i class="fa fa-times" />
                    </button>
                </div>

                <div class="config-panel-content">
                    <!-- Basic Section -->
                    <div class="config-section">
                        <h4 class="section-title">Basic</h4>
                        
                        <div class="form-group">
                            <label>Name</label>
                            <div class="input-with-actions">
                                <input
                                    type="text"
                                    v-model="configForm.name"
                                    :maxlength="50"
                                    class="form-input"
                                />
                                <span class="char-counter">{{ configForm.name.length }}/50</span>
                                <button class="input-action-btn" @click="configForm.name = ''" v-if="configForm.name">
                                    <i class="fa fa-times" />
                                </button>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Group</label>
                            <div class="input-with-actions">
                                <input
                                    type="text"
                                    v-model="configForm.group"
                                    placeholder="Filter by group name"
                                    class="form-input"
                                />
                                <button class="input-action-btn info-btn" title="Information">
                                    <i class="fa fa-info-circle" />
                                </button>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Platform</label>
                            <div class="platform-select-wrapper">
                                <div 
                                    class="platform-select-input"
                                    @click="showPlatformDropdown = !showPlatformDropdown"
                                    :class="{ 'active': showPlatformDropdown }"
                                >
                                    <div class="platform-display">
                                        <img 
                                            v-if="selectedPlatformIcon && !isCustomPlatform" 
                                            :src="selectedPlatformIcon" 
                                            class="platform-icon-img"
                                            @error="handleImageError"
                                        />
                                        <i v-else class="fa fa-globe platform-icon-fallback" />
                                        <span class="platform-text">{{ displayPlatformText }}</span>
                                    </div>
                                    <i class="fa fa-chevron-down dropdown-arrow" :class="{ 'rotated': showPlatformDropdown }" />
                                </div>
                                <div v-if="showPlatformDropdown" class="platform-dropdown" @click.stop>
                                    <div class="platform-search">
                                        <i class="fa fa-search" />
                                        <input 
                                            type="text" 
                                            v-model="platformSearchQuery"
                                            placeholder="Search platforms..."
                                            @click.stop
                                        />
                                    </div>
                                    <div class="platform-list">
                                        <div
                                            v-for="platform in filteredPlatforms"
                                            :key="platform.url || 'custom'"
                                            class="platform-option"
                                            :class="{ 'selected': isPlatformSelected(platform) }"
                                            @click="selectPlatform(platform)"
                                        >
                                            <img 
                                                v-if="platform.icon" 
                                                :src="platform.icon" 
                                                class="platform-option-icon"
                                                @error="handleImageError"
                                            />
                                            <i v-else class="fa fa-edit platform-option-icon-fallback" />
                                            <span class="platform-option-text">{{ platform.domain || platform.name }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="isCustomPlatform" class="custom-platform-input">
                                    <input
                                        type="text"
                                        v-model="configForm.platform"
                                        placeholder="Enter custom URL (e.g., https://example.com)"
                                        class="form-input"
                                        @click.stop
                                    />
                                </div>
                                <button class="input-action-btn info-btn" title="Information" @click.stop>
                                    <i class="fa fa-info-circle" />
                                </button>
                            </div>
                            <div class="platform-info-message">
                                <p>Please select the account platform or "Custom Platform" to set the URL. Opening the browser will open the account platform by default and the username and password set below will be automatically filled in the login page of the platform.</p>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Username</label>
                            <div class="input-with-actions">
                                <input
                                    type="text"
                                    v-model="configForm.username"
                                    placeholder="Set platform login username"
                                    :maxlength="100"
                                    class="form-input"
                                />
                                <span class="char-counter">{{ configForm.username.length }}/100</span>
                                <button class="input-action-btn info-btn" title="Information">
                                    <i class="fa fa-info-circle" />
                                </button>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Password</label>
                            <div class="input-with-actions">
                                <input
                                    :type="showPassword ? 'text' : 'password'"
                                    v-model="configForm.password"
                                    placeholder="Set platform login password"
                                    :maxlength="100"
                                    class="form-input"
                                />
                                <span class="char-counter">{{ configForm.password.length }}/100</span>
                                <button class="input-action-btn" @click="showPassword = !showPassword" title="Toggle visibility">
                                    <i class="fa" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'" />
                                </button>
                                <button class="input-action-btn info-btn" title="Information">
                                    <i class="fa fa-info-circle" />
                                </button>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Multi-open settings</label>
                            <div class="radio-group">
                                <label class="radio-label">
                                    <input type="radio" v-model="configForm.multiOpen" value="allowed" />
                                    <span>Allowed</span>
                                    <button class="input-action-btn info-btn" title="Information">
                                        <i class="fa fa-info-circle" />
                                    </button>
                                </label>
                                <label class="radio-label">
                                    <input type="radio" v-model="configForm.multiOpen" value="not-allowed" />
                                    <span>Not Allowed</span>
                                    <button class="input-action-btn info-btn" title="Information">
                                        <i class="fa fa-info-circle" />
                                    </button>
                                </label>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>2FA Key</label>
                            <div class="input-with-actions">
                                <input
                                    :type="show2FA ? 'text' : 'password'"
                                    v-model="configForm.twoFAKey"
                                    placeholder="Please enter the key"
                                    :maxlength="100"
                                    class="form-input"
                                />
                                <span class="char-counter">{{ configForm.twoFAKey.length }}/100</span>
                                <button class="input-action-btn" @click="show2FA = !show2FA" title="Toggle visibility">
                                    <i class="fa" :class="show2FA ? 'fa-eye-slash' : 'fa-eye'" />
                                </button>
                                <button class="input-action-btn info-btn" title="Information">
                                    <i class="fa fa-info-circle" />
                                </button>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Remark</label>
                            <div class="input-with-actions">
                                <textarea
                                    v-model="configForm.remark"
                                    placeholder="Enter the browser remarks"
                                    :maxlength="500"
                                    class="form-textarea"
                                    rows="3"
                                ></textarea>
                                <span class="char-counter">{{ configForm.remark.length }}/500</span>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Cookie</label>
                            <div class="cookie-section">
                                <textarea
                                    v-model="configForm.cookie"
                                    placeholder="Paste cookie JSON here"
                                    class="form-textarea cookie-textarea"
                                    rows="8"
                                ></textarea>
                                <div class="cookie-actions">
                                    <a href="#" @click.prevent="pasteCookie">Paste</a>
                                    <a href="#" @click.prevent="backupCookie">Backup</a>
                                </div>
                            </div>
                            <button class="btn-secondary" @click="addOtherCookie">
                                Add Other Cookie
                            </button>
                        </div>

                        <div class="form-group">
                            <label>Open URL</label>
                            <div class="url-section">
                                <textarea
                                    v-model="configForm.openUrl"
                                    placeholder="URL prefix: http://, https:// or chrome-extension://;&#10;For multiple URLs, use &quot;Enter&quot; to break each line;&#10;Click the &quot;+&quot; button on the right after entering all the URLs."
                                    class="form-textarea"
                                    rows="4"
                                ></textarea>
                                <div class="url-actions">
                                    <button class="icon-btn-small" @click="addUrl" title="Add URL">
                                        <i class="fa fa-plus" />
                                    </button>
                                    <button class="icon-btn-small info-btn" title="Information">
                                        <i class="fa fa-info-circle" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Proxy Section -->
                    <div class="config-section">
                        <h4 class="section-title">Proxy</h4>
                        
                        <div class="form-group">
                            <label>Method</label>
                            <div class="radio-group">
                                <label class="radio-label">
                                    <input type="radio" v-model="configForm.proxyMethod" value="custom" />
                                    <span>Custom</span>
                                </label>
                                <label class="radio-label">
                                    <input type="radio" v-model="configForm.proxyMethod" value="api" />
                                    <span>Extract By API</span>
                                </label>
                                <label class="radio-label">
                                    <input type="radio" v-model="configForm.proxyMethod" value="management" />
                                    <span>Proxy Management</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="config-panel-footer">
                    <button class="btn-random" @click="randomFingerprint">
                        Random Fingerprint
                    </button>
                    <button class="btn-cancel" @click="closeConfigPanel">
                        Cancel
                    </button>
                    <button class="btn-confirm" @click="saveConfig">
                        Confirm
                    </button>
                </div>

                <!-- Right Sidebar Icons -->
                <div class="config-panel-sidebar">
                    <button class="sidebar-icon-btn" title="Browser">
                        <i class="fa fa-globe" />
                    </button>
                    <button class="sidebar-icon-btn" title="IP">
                        <i class="fa fa-server" />
                    </button>
                    <button class="sidebar-icon-btn" title="Settings">
                        <i class="fa fa-cog" />
                    </button>
                    <button class="sidebar-icon-btn" title="Fingerprint">
                        <i class="fa fa-fingerprint" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { mapGetters, mapMutations } from "vuex";
import { EventBus } from "@renderer/utils/event-bus";

interface SidebarTab {
    id: string;
    label: string;
    count?: number;
}

export default {
    data() {
        return {
            activeSidebarTab: "all",
            selectedSessions: [] as number[],
            sortField: "seq" as string,
            sortDirection: "asc" as "asc" | "desc",
            currentPage: 1,
            recordsPerPage: 10,
            gotoPage: 1,
            favorites: [] as number[],
            remarks: {} as Record<number, string>,
            createdTimes: {} as Record<number, Date>,
            lastOpened: {} as Record<number, Date>,
            sidebarTabs: [
                { id: "all", label: "All" },
                { id: "mine", label: "Mine" },
                { id: "fav", label: "Fav" },
                { id: "opened", label: "Opened", count: 0 },
                { id: "share", label: "Share" },
                { id: "transfer", label: "Transfer" },
            ] as SidebarTab[],
            showConfigPanel: false,
            selectedConfigIndex: null as number | null,
            showPassword: false,
            show2FA: false,
            showPlatformDropdown: false,
            platformSearchQuery: "",
            platforms: [
                { name: "TikTok", domain: "tiktok.com", url: "https://www.tiktok.com/", icon: "https://www.tiktok.com/favicon.ico" },
                { name: "Instagram", domain: "instagram.com", url: "https://www.instagram.com/", icon: "https://www.instagram.com/static/images/ico/favicon.ico" },
                { name: "X", domain: "x.com", url: "https://www.x.com/", icon: "https://abs.twimg.com/favicons/twitter.3.ico" },
                { name: "WhatsApp", domain: "web.whatsapp.com", url: "https://web.whatsapp.com/", icon: "https://web.whatsapp.com/favicon.ico" },
                { name: "LINE", domain: "line.me", url: "https://line.me/", icon: "https://line.me/favicon.ico" },
                { name: "LinkedIn", domain: "linkedin.com", url: "https://www.linkedin.com/", icon: "https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" },
                { name: "LinkedIn China", domain: "linkedin.cn", url: "https://www.linkedin.cn/", icon: "https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" },
                { name: "Tinder", domain: "tinder.com", url: "https://www.tinder.com/", icon: "https://www.tinder.com/favicon.ico" },
                { name: "YouTube", domain: "youtube.com", url: "https://www.youtube.com/", icon: "https://www.youtube.com/s/desktop/favicon.ico" },
                { name: "Amazon", domain: "amazon.com", url: "https://www.amazon.com/", icon: "https://www.amazon.com/favicon.ico" },
                { name: "PayPal", domain: "paypal.com", url: "https://www.paypal.com/", icon: "https://www.paypal.com/favicon.ico" },
                { name: "Google", domain: "accounts.google.com", url: "https://accounts.google.com/", icon: "https://www.google.com/favicon.ico" },
                { name: "AliExpress", domain: "aliexpress.com", url: "https://www.aliexpress.com/", icon: "https://www.aliexpress.com/favicon.ico" },
                { name: "Alibaba", domain: "alibaba.com", url: "https://www.alibaba.com/", icon: "https://www.alibaba.com/favicon.ico" },
                { name: "Vinted", domain: "vinted.com", url: "https://www.vinted.com/", icon: "https://www.vinted.com/favicon.ico" },
                { name: "eBay", domain: "ebay.com", url: "https://www.ebay.com/", icon: "https://www.ebay.com/favicon.ico" },
                { name: "Lazada", domain: "lazada.com", url: "https://www.lazada.com/", icon: "https://www.lazada.com/favicon.ico" },
                { name: "Mail.com", domain: "mail.com", url: "https://www.mail.com/", icon: "https://www.mail.com/favicon.ico" },
                { name: "Outlook", domain: "outlook.com", url: "https://outlook.com/", icon: "https://outlook.com/favicon.ico" },
                { name: "Payoneer", domain: "payoneer.com", url: "https://www.payoneer.com/", icon: "https://www.payoneer.com/favicon.ico" },
                { name: "Shopify", domain: "shopify.com", url: "https://www.shopify.com/", icon: "https://www.shopify.com/favicon.ico" },
                { name: "Custom Platform", domain: "Custom Platform", url: null, icon: null, isCustom: true },
            ],
            selectedPlatform: null as any,
            configForm: {
                name: "",
                group: "",
                platform: "",
                username: "",
                password: "",
                multiOpen: "allowed",
                twoFAKey: "",
                remark: "",
                cookie: "",
                openUrl: "",
                proxyMethod: "custom",
            },
        };
    },

    computed: {
        ...mapGetters("sessions", [
            "sessions",
            "currentSessionIndex",
        ]),
        ...mapGetters("theme", ["isDark"]),
        theme() {
            return this.isDark ? "dark" : "light";
        },

        allSelected(): boolean {
            return (
                this.sessions.length > 0 &&
                this.selectedSessions.length === this.sessions.length
            );
        },

        sortedSessions() {
            // Create array with indices
            const sessionsWithIndices = this.sessions.map((session, index) => ({
                session,
                index,
            }));

            sessionsWithIndices.sort((a, b) => {
                let comparison = 0;
                switch (this.sortField) {
                    case "seq":
                        comparison = a.index - b.index;
                        break;
                    case "name":
                        comparison = this.getSessionName(a.session, a.index).localeCompare(
                            this.getSessionName(b.session, b.index),
                        );
                        break;
                    case "created":
                        comparison =
                            (this.createdTimes[a.index]?.getTime() || 0) -
                            (this.createdTimes[b.index]?.getTime() || 0);
                        break;
                    case "opened":
                        comparison =
                            (this.lastOpened[a.index]?.getTime() || 0) -
                            (this.lastOpened[b.index]?.getTime() || 0);
                        break;
                }

                return this.sortDirection === "asc" ? comparison : -comparison;
            });

            // Pagination
            const start = (this.currentPage - 1) * this.recordsPerPage;
            const end = start + this.recordsPerPage;
            return sessionsWithIndices.slice(start, end);
        },

        totalPages(): number {
            return Math.ceil(this.sessions.length / this.recordsPerPage);
        },

        filteredPlatforms() {
            if (!this.platformSearchQuery) {
                return this.platforms;
            }
            const query = this.platformSearchQuery.toLowerCase();
            return this.platforms.filter(platform => 
                platform.name.toLowerCase().includes(query) ||
                platform.domain.toLowerCase().includes(query)
            );
        },

        selectedPlatformIcon() {
            if (this.selectedPlatform && this.selectedPlatform.icon) {
                return this.selectedPlatform.icon;
            }
            return null;
        },

        displayPlatformText() {
            if (this.isCustomPlatform) {
                return this.configForm.platform || "Custom Platform";
            }
            if (this.selectedPlatform) {
                return this.selectedPlatform.domain || this.selectedPlatform.name;
            }
            if (this.configForm.platform) {
                // Try to find matching platform
                const platform = this.platforms.find(p => p.url === this.configForm.platform);
                if (platform) {
                    return platform.domain;
                }
                return this.configForm.platform;
            }
            return "Select platform...";
        },

        isCustomPlatform() {
            return this.selectedPlatform && this.selectedPlatform.isCustom;
        },
    },

    mounted() {
        // Initialize created times for existing sessions
        this.sessions.forEach((session, index) => {
            if (!this.createdTimes[index]) {
                this.createdTimes[index] = new Date();
            }
        });

        // Load favorites from localStorage
        const savedFavorites = localStorage.getItem("browser-profiles-favorites");
        if (savedFavorites) {
            this.favorites = JSON.parse(savedFavorites);
        }

        // Load remarks from localStorage
        const savedRemarks = localStorage.getItem("browser-profiles-remarks");
        if (savedRemarks) {
            this.remarks = JSON.parse(savedRemarks);
        }

        // Close platform dropdown when clicking outside
        document.addEventListener('click', this.handleClickOutside);
    },

    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    },

    watch: {
        favorites: {
            handler(newVal) {
                localStorage.setItem("browser-profiles-favorites", JSON.stringify(newVal));
            },
            deep: true,
        },
        remarks: {
            handler(newVal) {
                localStorage.setItem("browser-profiles-remarks", JSON.stringify(newVal));
            },
            deep: true,
        },
        gotoPage(newVal) {
            if (newVal >= 1 && newVal <= this.totalPages) {
                this.currentPage = newVal;
            }
        },
    },

    methods: {
        ...mapMutations("sessions", [
            "addSession",
            "removeSession",
            "setActiveSession",
        ]),

        getSessionName(session: any, index: number): string {
            // Use session name if available
            if (session.name) {
                return session.name;
            }
            // Fallback to generating name from first tab
            const firstTab = session.tabs.find((tab: any) => tab.url);
            if (firstTab?.url) {
                try {
                    const url = new URL(firstTab.url);
                    return `${url.hostname} - ${firstTab.title || "F..."}`;
                } catch {
                    return firstTab.title || `Session${index + 1}`;
                }
            }
            return `Session${index + 1}`;
        },

        getPlatform(session: any): string {
            const firstTab = session.tabs.find((tab: any) => tab.url);
            if (firstTab?.url) {
                try {
                    const url = new URL(firstTab.url);
                    return url.hostname;
                } catch {
                    return "Default";
                }
            }
            return "Default";
        },

        getProxyIP(session: any): string | null {
            // This would come from session settings if proxy was implemented
            return null;
        },

        getRemark(session: any): string {
            const index = this.sessions.indexOf(session);
            return this.remarks[index] || "";
        },

        updateRemark(index: number, event: Event) {
            const target = event.target as HTMLInputElement;
            this.remarks[index] = target.value;
        },

        getCreatedTime(session: any, index: number): string {
            const date = this.createdTimes[index] || new Date();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            return `${month}/${day} ${hours}:${minutes}`;
        },

        getLastOpened(session: any, index: number): string {
            const date = this.lastOpened[index];
            if (!date) return "";
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            const seconds = String(date.getSeconds()).padStart(2, "0");
            return `${month}-${day} ${hours}:${minutes}:${seconds}`;
        },

        openSession(index: number) {
            this.setActiveSession(index);
            this.lastOpened[index] = new Date();
            EventBus.emit("session-selected");
        },

        showOpenMenu(index: number) {
            // TODO: Implement context menu
            console.log("Show menu for session", index);
        },

        toggleSelect(index: number) {
            const idx = this.selectedSessions.indexOf(index);
            if (idx > -1) {
                this.selectedSessions.splice(idx, 1);
            } else {
                this.selectedSessions.push(index);
            }
        },

        toggleSelectAll() {
            if (this.allSelected) {
                this.selectedSessions = [];
            } else {
                this.selectedSessions = this.sessions.map((_, i) => i);
            }
        },

        deleteSelected() {
            if (this.selectedSessions.length === 0) return;

            if (
                confirm(
                    `Are you sure you want to delete ${this.selectedSessions.length} profile(s)?`,
                )
            ) {
                // Sort in descending order to avoid index shifting issues
                const sorted = [...this.selectedSessions].sort((a, b) => b - a);
                sorted.forEach((index) => {
                    if (this.sessions.length > 1) {
                        this.removeSession(index);
                    }
                });
                this.selectedSessions = [];
            }
        },

        deleteSession(index: number) {
            const sessionName = this.sessions[index]?.name || `Session${index + 1}`;
            if (
                confirm(
                    `Are you sure you want to delete "${sessionName}"?`,
                )
            ) {
                if (this.sessions.length > 1) {
                    this.removeSession(index);
                    // Remove from selected if it was selected
                    const selectedIdx = this.selectedSessions.indexOf(index);
                    if (selectedIdx > -1) {
                        this.selectedSessions.splice(selectedIdx, 1);
                    }
                } else {
                    alert("Cannot delete the last session. Please create a new session first.");
                }
            }
        },

        addNewSession() {
            const sessionName = `Session${this.sessions.length + 1}`;
            const newIndex = this.sessions.length;
            // Use $store.commit directly to ensure it works
            this.$store.commit("sessions/addSession", sessionName);
            this.createdTimes[newIndex] = new Date();
        },

        updateSessionName(index: number, event: Event) {
            const target = event.target as HTMLInputElement;
            const newName = target.value.trim();
            if (newName) {
                this.$store.commit("sessions/updateSessionName", {
                    sessionIndex: index,
                    name: newName,
                });
            } else {
                // Reset to default if empty
                target.value = this.getSessionName(this.sessions[index], index);
            }
        },

        cancelNameEdit(event: Event) {
            const target = event.target as HTMLInputElement;
            target.blur();
        },

        refresh() {
            // Refresh the view
            this.$forceUpdate();
        },

        sortBy(field: string) {
            if (this.sortField === field) {
                this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
            } else {
                this.sortField = field;
                this.sortDirection = "asc";
            }
        },

        getSortIcon(field: string): string {
            if (this.sortField !== field) return "fa-sort";
            return this.sortDirection === "asc" ? "fa-sort-up" : "fa-sort-down";
        },

        isFavorite(index: number): boolean {
            return this.favorites.includes(index);
        },

        toggleFavorite(index: number) {
            const idx = this.favorites.indexOf(index);
            if (idx > -1) {
                this.favorites.splice(idx, 1);
            } else {
                this.favorites.push(index);
            }
        },

        openConfigPanel(index: number) {
            this.selectedConfigIndex = index;
            const session = this.sessions[index];
            
            // Get platform URL from session
            const platformUrl = this.getPlatform(session);
            const fullUrl = platformUrl.startsWith('http') ? platformUrl : `https://${platformUrl}`;
            
            // Find matching platform or set as custom
            const matchingPlatform = this.platforms.find(p => p.url === fullUrl || p.url === platformUrl);
            this.selectedPlatform = matchingPlatform || null;
            
            // Populate form with session data
            this.configForm = {
                name: session.name || `Session${index + 1}`,
                group: "Ungrouped",
                platform: matchingPlatform ? matchingPlatform.url : (platformUrl.startsWith('http') ? platformUrl : `https://${platformUrl}`),
                username: "",
                password: "",
                multiOpen: "allowed",
                twoFAKey: "",
                remark: this.remarks[index] || "",
                cookie: "",
                openUrl: session.settings.homePage || "",
                proxyMethod: "custom",
            };
            
            this.showConfigPanel = true;
        },

        closeConfigPanel() {
            this.showConfigPanel = false;
            this.selectedConfigIndex = null;
        },

        copySessionId() {
            if (this.selectedConfigIndex !== null) {
                const session = this.sessions[this.selectedConfigIndex];
                navigator.clipboard.writeText(session.id).then(() => {
                    alert("Session ID copied to clipboard!");
                });
            }
        },

        saveConfig() {
            if (this.selectedConfigIndex === null) return;
            
            // Update session name
            if (this.configForm.name) {
                this.$store.commit("sessions/updateSessionName", {
                    sessionIndex: this.selectedConfigIndex,
                    name: this.configForm.name,
                });
            }
            
            // Update remark
            this.remarks[this.selectedConfigIndex] = this.configForm.remark;
            
            // Update home page if URL changed
            if (this.configForm.openUrl) {
                this.$store.commit("sessions/updateSessionSetting", {
                    sessionIndex: this.selectedConfigIndex,
                    k: "homePage",
                    v: this.configForm.openUrl.split("\n")[0] || this.configForm.openUrl,
                });
            }
            
            this.closeConfigPanel();
        },

        randomFingerprint() {
            // TODO: Implement random fingerprint generation
            alert("Random fingerprint feature coming soon!");
        },

        pasteCookie() {
            navigator.clipboard.readText().then((text) => {
                this.configForm.cookie = text;
            }).catch(() => {
                alert("Failed to read from clipboard");
            });
        },

        backupCookie() {
            if (this.configForm.cookie) {
                navigator.clipboard.writeText(this.configForm.cookie).then(() => {
                    alert("Cookie backed up to clipboard!");
                });
            }
        },

        addOtherCookie() {
            // TODO: Implement add other cookie
            alert("Add other cookie feature coming soon!");
        },

        addUrl() {
            // Already handled in saveConfig
        },

        selectPlatform(platform: any) {
            this.selectedPlatform = platform;
            if (platform.isCustom) {
                // For custom platform, keep the current URL or set empty
                if (!this.configForm.platform) {
                    this.configForm.platform = "";
                }
            } else {
                // For predefined platforms, set the URL
                this.configForm.platform = platform.url;
            }
            this.showPlatformDropdown = false;
            this.platformSearchQuery = "";
        },

        isPlatformSelected(platform: any) {
            if (platform.isCustom) {
                return this.isCustomPlatform && !this.platforms.some(p => p.url === this.configForm.platform);
            }
            return this.configForm.platform === platform.url;
        },

        handleImageError(event: Event) {
            const img = event.target as HTMLImageElement;
            img.style.display = 'none';
        },

        handleClickOutside(event: MouseEvent) {
            const target = event.target as HTMLElement;
            if (!target.closest('.platform-select-wrapper')) {
                this.showPlatformDropdown = false;
            }
        },
    },
};
</script>

<style scoped lang="scss">
.browser-profiles {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    overflow: hidden;
    transition: background-color 0.3s ease;
}

.toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    gap: 16px;
    transition: background-color 0.3s ease, border-color 0.3s ease;
}

.toolbar-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.btn-add {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: var(--button-bg);
    color: white;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: background 0.2s ease;

    &:hover {
        background: var(--button-hover);
    }
}

.stats-text {
    font-size: 13px;
    color: var(--text-secondary);
    white-space: nowrap;
    transition: color 0.3s ease;
}

.btn-subscribe {
    padding: 8px 16px;
    background: var(--bg-tertiary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    border-radius: 2px;
    cursor: pointer;
    font-size: 13px;
    transition: all 0.2s ease;

    &:hover {
        background: var(--hover-bg);
        border-color: var(--accent-color);
        color: var(--accent-color);
    }
}

.toolbar-center {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    max-width: 500px;
}

.filter-select,
.filter-input {
    padding: 6px 10px;
    border: 1px solid var(--border-color);
    border-radius: 2px;
    font-size: 13px;
    background: var(--input-bg);
    color: var(--text-primary);
    transition: all 0.2s ease;

    &:focus {
        outline: none;
        border-color: var(--accent-color);
        background: var(--bg-tertiary);
    }
}

.filter-input {
    flex: 1;
    min-width: 150px;
}

.toolbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-advanced {
    padding: 6px 12px;
    background: transparent;
    border: 1px solid var(--border-color);
    border-radius: 2px;
    cursor: pointer;
    font-size: 13px;
    color: var(--text-primary);
    transition: all 0.2s ease;

    &:hover {
        background: var(--hover-bg);
        border-color: var(--accent-color);
        color: var(--accent-color);
    }
}

.icon-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    color: var(--text-secondary);
    font-size: 14px;
    transition: all 0.2s ease;

    &:hover {
        background: var(--hover-bg);
        color: var(--accent-color);
    }
}

.sidebar-tabs {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 16px;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    transition: background-color 0.3s ease, border-color 0.3s ease;
}

.sidebar-tab {
    padding: 8px 16px;
    background: transparent;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    font-size: 13px;
    color: var(--text-secondary);
    white-space: nowrap;
    transition: all 0.2s ease;

    &:hover {
        background: var(--hover-bg);
        color: var(--text-primary);
    }

    &.active {
        background: var(--selected-bg);
        color: var(--accent-color);
    }

    .tab-count {
        font-size: 11px;
        opacity: 0.8;
    }

    &.filter-icon {
        margin-left: auto;
        padding: 8px;
    }
}

.action-buttons {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 16px;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    transition: background-color 0.3s ease, border-color 0.3s ease;
}

.table-container {
    flex: 1;
    overflow: auto;
    background: var(--bg-primary);
    transition: background-color 0.3s ease;
    display: block;
}

.profiles-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    table-layout: fixed;

    thead {
        background: var(--bg-secondary);
        position: sticky;
        top: 0;
        z-index: 10;
        transition: background-color 0.3s ease;

        th {
            padding: 6px 8px;
            text-align: left;
            font-weight: 600;
            color: var(--text-primary);
            border-bottom: 2px solid var(--border-color);
            white-space: nowrap;
            transition: color 0.3s ease, border-color 0.3s ease;
            font-size: 11px;
            line-height: 1.3;

            &.sortable {
                cursor: pointer;
                user-select: none;
                transition: background 0.2s ease;

                &:hover {
                    background: var(--hover-bg);
                }

                i {
                    margin-left: 4px;
                    font-size: 10px;
                    color: var(--text-tertiary);
                }
            }

            .info-icon {
                margin-left: 4px;
                color: var(--text-tertiary);
                font-size: 11px;
            }
        }
    }

    tbody {
        tr {
            height: 32px;
            min-height: 32px;
            max-height: 32px;
            border-bottom: 1px solid var(--border-light);
            transition: background 0.2s ease;

            &:hover {
                background: var(--hover-bg);
            }

            &.active {
                background: var(--selected-bg);
            }

            &.selected {
                background: var(--active-bg);
            }

            td {
                padding: 4px 8px;
                color: var(--text-primary);
                vertical-align: middle;
                transition: color 0.3s ease;
                font-size: 11px;
                line-height: 1.3;
                height: 32px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
}

.col-checkbox {
    width: 40px;
    text-align: center;

    input[type="checkbox"] {
        cursor: pointer;
    }
}

.col-seq {
    width: 60px;
}

.col-group {
    width: 100px;
}

.col-name {
    min-width: 200px;

    .name-cell {
        display: flex;
        align-items: center;
        gap: 4px;

        i {
            color: var(--accent-color);
        }

        .name-input {
            flex: 1;
            padding: 2px 4px;
            border: 1px solid transparent;
            border-radius: 2px;
            font-size: 11px;
            line-height: 1.2;
            height: 20px;
            background: transparent;
            color: var(--text-primary);
            min-width: 0;
            transition: all 0.2s ease;

            &:focus {
                border-color: var(--accent-color);
                background: var(--input-bg);
                outline: none;
            }

            &:hover:not(:focus) {
                background: var(--hover-bg);
            }
        }
    }
}

.col-platform {
    min-width: 150px;

    .platform-cell {
        display: flex;
        align-items: center;
        gap: 4px;

        i {
            color: #4a90e2;
        }
    }
}

.col-proxy {
    min-width: 180px;

    .proxy-cell {
        display: flex;
        align-items: center;
        gap: 4px;

        .proxy-icon {
            display: inline-block;
            width: 20px;
            height: 20px;
            background: #ff9800;
            color: white;
            border-radius: 3px;
            text-align: center;
            line-height: 20px;
            font-size: 11px;
            font-weight: bold;
        }

        .proxy-ip {
            font-size: 12px;
            color: var(--text-secondary);
        }
    }
}

.col-remark {
    min-width: 120px;

    .remark-input {
        width: 100%;
        padding: 2px 4px;
        border: 1px solid transparent;
        border-radius: 2px;
        font-size: 10px;
        line-height: 1.2;
        height: 20px;
        background: transparent;
        color: var(--text-primary);
        transition: all 0.2s ease;

        &:focus {
            border-color: var(--accent-color);
            background: var(--input-bg);
            outline: none;
        }

        &::placeholder {
            color: var(--text-tertiary);
        }
    }
}

.col-created {
    min-width: 140px;

    .created-cell {
        display: flex;
        align-items: center;
        gap: 4px;

        i {
            color: #999;
            font-size: 11px;
        }
    }
}

.col-config {
    width: 60px;
    text-align: center;

    .config-btn {
        background: transparent;
        border: none;
        cursor: pointer;
        color: var(--text-secondary);
        font-size: 14px;
        padding: 2px;
        transition: all 0.2s ease;

        &:hover {
            color: var(--accent-color);
        }
    }
}

.col-open {
    min-width: 140px;
    position: relative;

    .open-cell {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 1px;

        .btn-open {
            padding: 2px 8px;
            background: var(--button-bg);
            color: white;
            border: none;
            border-radius: 2px;
            cursor: pointer;
            font-size: 10px;
            transition: background 0.2s ease;
            line-height: 1.2;
            height: 20px;

            &:hover {
                background: var(--button-hover);
            }
        }

        .open-time {
            font-size: 10px;
            color: var(--text-secondary);
            line-height: 1.2;
        }

        .open-menu {
            position: absolute;
            top: 12px;
            right: 8px;
            background: transparent;
            border: none;
            cursor: pointer;
            color: var(--text-tertiary);
            padding: 4px;
            transition: color 0.2s ease;

            &:hover {
                color: var(--accent-color);
            }
        }
    }
}

.col-fav {
    width: 50px;
    text-align: center;

    .fav-btn {
        background: transparent;
        border: none;
        cursor: pointer;
        color: var(--text-secondary);
        font-size: 14px;
        padding: 2px;
        transition: color 0.2s ease;

        &:hover {
            color: #ffc107;
        }

        &.active {
            color: #ffc107;
        }
    }
}

.col-delete {
    width: 50px;
    text-align: center;

    .delete-btn {
        background: transparent;
        border: none;
        cursor: pointer;
        color: var(--text-secondary);
        font-size: 14px;
        padding: 2px;
        transition: color 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 2px;

        &:hover {
            color: #e81123;
            background: rgba(232, 17, 35, 0.1);
        }

        &:active {
            transform: scale(0.95);
        }
    }
}

.empty-row {
    height: auto;
    border: none !important;

    .empty-state {
        text-align: center;
        padding: 0;
        height: 100%;
        min-height: 500px;
        background: var(--bg-primary);
        border: none;
        vertical-align: middle;

        .empty-state-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 120px 20px;
            min-height: 500px;

            i {
                font-size: 72px;
                color: var(--text-tertiary);
                margin-bottom: 24px;
                opacity: 0.6;
            }

            p {
                font-size: 16px;
                color: var(--text-secondary);
                margin-bottom: 32px;
                font-weight: 400;
            }

            .btn-add {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 12px 24px;
                background: var(--button-bg);
                color: white;
                border: none;
                border-radius: 2px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.2s ease;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

                &:hover {
                    background: var(--button-hover);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                    transform: translateY(-1px);
                }

                i {
                    font-size: 14px;
                    margin: 0;
                }
            }
        }
    }
}

.pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: var(--bg-secondary);
    border-top: 1px solid var(--border-color);
    transition: background-color 0.3s ease, border-color 0.3s ease;
}

.pagination-left {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    color: #999;
}

.records-select {
    padding: 4px 8px;
    border: 1px solid var(--border-color);
    border-radius: 2px;
    font-size: 12px;
    background: var(--input-bg);
    color: var(--text-primary);
    transition: all 0.2s ease;

    &:focus {
        outline: none;
        border-color: var(--accent-color);
    }
}

.pagination-right {
    display: flex;
    align-items: center;
    gap: 4px;
}

.page-btn {
    min-width: 32px;
    height: 32px;
    padding: 0 8px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 2px;
    cursor: pointer;
    font-size: 13px;
    color: var(--text-primary);
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
        background: var(--hover-bg);
        border-color: var(--accent-color);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    &.active {
        background: var(--button-bg);
        color: white;
        border-color: var(--accent-color);
    }
}

.goto-page {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: 12px;
    font-size: 13px;

    .goto-input {
        width: 50px;
        padding: 4px 8px;
        border: 1px solid #ddd;
        border-radius: 3px;
        text-align: center;
    }
}

// Scrollbar styling
.table-container::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.table-container::-webkit-scrollbar-track {
    background: #f5f5f5;
}

.table-container::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;

    &:hover {
        background: #999;
    }
}

// Config Panel Styles
.config-panel-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    justify-content: flex-end;
    animation: fadeIn 0.3s ease;
}

.config-panel {
    width: 800px;
    max-width: 90vw;
    height: 100vh;
    background: var(--bg-primary);
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    animation: slideInRight 0.3s ease;
    position: relative;
    overflow: hidden;
    transition: background-color 0.3s ease;
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
    }
    to {
        transform: translateX(0);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.config-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-secondary);
    transition: background-color 0.3s ease, border-color 0.3s ease;

    .panel-title {
        display: flex;
        align-items: center;
        gap: 12px;

        h3 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary);
            transition: color 0.3s ease;
        }

        .copy-id-link {
            color: var(--accent-color);
            text-decoration: none;
            font-size: 13px;
            transition: color 0.2s ease;

            &:hover {
                text-decoration: underline;
                color: var(--accent-hover);
            }
        }
    }

    .panel-close {
        background: transparent;
        border: none;
        font-size: 20px;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 4px 8px;
        transition: color 0.2s ease;

        &:hover {
            color: var(--text-primary);
        }
    }
}

.config-panel-content {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
}

.config-section {
    margin-bottom: 32px;

    .section-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 20px;
        padding-bottom: 8px;
        border-bottom: 2px solid var(--border-color);
        transition: color 0.3s ease, border-color 0.3s ease;
    }
}

.form-group {
    margin-bottom: 20px;

    label {
        display: block;
        font-size: 13px;
        font-weight: 500;
        color: var(--text-secondary);
        margin-bottom: 8px;
        transition: color 0.3s ease;
    }
}

.input-with-actions {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;

    .form-input,
    .form-textarea {
        flex: 1;
        padding: 10px 12px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        font-size: 14px;
        background: var(--bg-primary);
        color: var(--text-primary);
        transition: border-color 0.2s ease, background-color 0.3s ease, color 0.3s ease;

        &:focus {
            outline: none;
            border-color: var(--accent-color);
        }

        &::placeholder {
            color: var(--text-tertiary);
        }
    }

    .form-textarea {
        resize: vertical;
        font-family: inherit;
        font-size: 12px;
    }

    .char-counter {
        font-size: 11px;
        color: var(--text-tertiary);
        white-space: nowrap;
        transition: color 0.3s ease;
    }

    .input-action-btn {
        background: transparent;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 4px 8px;
        font-size: 14px;
        transition: color 0.2s ease;

        &:hover {
            color: var(--text-primary);
        }

        &.info-btn {
            color: var(--accent-color);

            &:hover {
                color: var(--accent-hover);
            }
        }
    }

    .platform-icon {
        color: var(--accent-color);
        font-size: 16px;
    }
}

.platform-select-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .platform-select-input {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 12px;
        border: 1px solid var(--border-color);
        border-radius: 2px;
        background: var(--bg-primary);
        cursor: pointer;
        transition: border-color 0.2s ease, background-color 0.3s ease;

        &:hover,
&.active {
            border-color: var(--accent-color);
        }

        .platform-display {
            display: flex;
            align-items: center;
            gap: 10px;
            flex: 1;
            min-width: 0;

            .platform-icon-img {
                width: 20px;
                height: 20px;
                object-fit: contain;
                flex-shrink: 0;
            }

            .platform-icon-fallback {
                width: 20px;
                height: 20px;
                color: var(--accent-color);
                flex-shrink: 0;
            }

            .platform-text {
                flex: 1;
                min-width: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 14px;
                color: var(--text-primary);
                transition: color 0.3s ease;
            }
        }

        .dropdown-arrow {
            color: var(--text-secondary);
            font-size: 12px;
            transition: transform 0.2s ease, color 0.3s ease;
            flex-shrink: 0;

            &.rotated {
                transform: rotate(180deg);
            }
        }
    }

    .platform-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        margin-top: 4px;
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        border-radius: 2px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        max-height: 400px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transition: background-color 0.3s ease, border-color 0.3s ease;

        .platform-search {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 12px;
            border-bottom: 1px solid var(--border-color);
            background: var(--bg-secondary);
            transition: background-color 0.3s ease, border-color 0.3s ease;

            i {
                color: var(--text-secondary);
                font-size: 14px;
            }

            input {
                flex: 1;
                border: none;
                outline: none;
                background: transparent;
                font-size: 14px;
                color: var(--text-primary);
                transition: color 0.3s ease;

                &::placeholder {
                    color: var(--text-tertiary);
                }
            }
        }

        .platform-list {
            flex: 1;
            overflow-y: auto;
            max-height: 350px;

            .platform-option {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px 12px;
                cursor: pointer;
                transition: background-color 0.2s ease;
                border-bottom: 1px solid var(--border-light);

                &:hover,
                &.selected {
                    background-color: var(--active-bg);
                }

                &:last-child {
                    border-bottom: none;
                }

                .platform-option-icon {
                    width: 20px;
                    height: 20px;
                    object-fit: contain;
                    flex-shrink: 0;
                }

                .platform-option-icon-fallback {
                    width: 20px;
                    height: 20px;
                    color: var(--accent-color);
                    flex-shrink: 0;
                }

                .platform-option-text {
                    flex: 1;
                    font-size: 14px;
                    color: var(--text-primary);
                    transition: color 0.3s ease;
                }
            }
        }
    }

    .custom-platform-input {
        margin-top: 8px;

        .form-input {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid var(--border-color);
            border-radius: 2px;
            font-size: 14px;
            background: var(--input-bg);
            color: var(--text-primary);
            transition: border-color 0.2s ease, background-color 0.3s ease, color 0.3s ease;

            &:focus {
                outline: none;
                border-color: var(--accent-color);
                background: var(--bg-tertiary);
            }
        }
    }
}

.platform-info-message {
    margin-top: 12px;
    padding: 12px 16px;
    background: var(--panel-bg);
    border: 1px solid var(--border-color);
    border-radius: 2px;
    transition: background-color 0.3s ease, border-color 0.3s ease;

    p {
        margin: 0;
        font-size: 13px;
        line-height: 1.6;
        color: var(--text-primary);
        transition: color 0.3s ease;
    }
}

.radio-group {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .radio-label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        font-size: 14px;
        color: var(--text-primary);
        transition: color 0.3s ease;

        input[type="radio"] {
            cursor: pointer;
        }
    }
}

.cookie-section {
    position: relative;

    .cookie-textarea {
        min-height: 200px;
        font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
        font-size: 11px;
    }

    .cookie-actions {
        position: absolute;
        top: 8px;
        right: 8px;
        display: flex;
        gap: 12px;

        a {
            color: #697ca6;
            text-decoration: none;
            font-size: 12px;

            &:hover {
                text-decoration: underline;
            }
        }
    }
}

.url-section {
    display: flex;
    gap: 8px;

    .form-textarea {
        flex: 1;
    }

    .url-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
}

.icon-btn-small {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #697ca6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.2s ease;

    &:hover {
        background: #9baed7;
    }
}

.btn-secondary {
    margin-top: 8px;
    padding: 8px 16px;
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    color: #333;
    transition: all 0.2s ease;

    &:hover {
        background: #e8e8e8;
        border-color: #ccc;
    }
}

.config-panel-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    border-top: 1px solid var(--border-color);
    background: var(--bg-secondary);
    gap: 12px;
    transition: background-color 0.3s ease, border-color 0.3s ease;

    .btn-random {
        padding: 10px 20px;
        background: var(--button-bg);
        color: white;
        border: none;
        border-radius: 2px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: background 0.2s ease;

        &:hover {
            background: var(--button-hover);
        }
    }

    .btn-cancel {
        padding: 10px 24px;
        background: var(--bg-tertiary);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
        border-radius: 2px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s ease;

        &:hover {
            background: var(--hover-bg);
            border-color: var(--accent-color);
            color: var(--text-primary);
        }
    }

    .btn-confirm {
        padding: 10px 24px;
        background: var(--button-bg);
        color: white;
        border: none;
        border-radius: 2px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: background 0.2s ease;

        &:hover {
            background: var(--button-hover);
        }
    }
}

.config-panel-sidebar {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 48px;
    background: var(--bg-secondary);
    border-left: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
    gap: 16px;
    transition: background-color 0.3s ease, border-color 0.3s ease;

    .sidebar-icon-btn {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        color: var(--accent-color);
        font-size: 16px;
        transition: all 0.2s ease;

        &:hover {
            background: var(--active-bg);
            color: var(--accent-hover);
        }
    }
}

// Scrollbar for config panel content
.config-panel-content::-webkit-scrollbar {
    width: 8px;
}

.config-panel-content::-webkit-scrollbar-track {
    background: #f5f5f5;
}

.config-panel-content::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;

    &:hover {
        background: #999;
    }
}
</style>
