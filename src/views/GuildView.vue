<template>
	<div>
		<div v-if="error">
			<ErrorMessage title="Error" :message="error_message" :red="true" />
		</div>
		<div v-if="(loading || !data) && !error">
			<Wrapper> test </Wrapper>
		</div>
		<div v-if="data && !error">
			<Wrapper>
				<v-expansion-panels multiple popout>
					<v-expansion-panel>
						<v-expansion-panel-header> Logs </v-expansion-panel-header>
						<v-expansion-panel-content>
							<v-container fluid>
								<v-row align="center" class="d-flex justify-start" no-gutters>
									<v-col cols="4" class="flex-shrink-0 flex-grow-0">
										<span class="grey--text darken-2">Logchannel</span>
									</v-col>
									<v-col
										cols="8"
										style="min-width: 100px"
										class="flex-shrink-1 flex-grow-0"
									>
										<v-select
											:items="getTextChannels()"
											label="Channel"
											v-model="log_channel"
										></v-select>
									</v-col>
								</v-row>
							</v-container>
						</v-expansion-panel-content>
					</v-expansion-panel>
					<v-expansion-panel>
						<v-expansion-panel-header> Music </v-expansion-panel-header>
						<v-expansion-panel-content>
							<v-container fluid>
								<v-row align="center" class="d-flex justify-start" no-gutters>
									<v-col cols="4" class="flex-shrink-0 flex-grow-0">
										<span class="grey--text darken-2">DJ Roles</span>
									</v-col>
									<v-col
										cols="8"
										style="min-width: 100px"
										class="flex-shrink-1 flex-grow-0"
									>
										<v-autocomplete
											v-model="dj_roles"
											:items="getRoles()"
											outlined
											dense
											label="DJ Roles"
											multiple
										>
											<template #selection="{ item }">
												<v-chip :color="item.color" small outlined>
													{{ item.text }}
												</v-chip>
											</template>
										</v-autocomplete>
									</v-col>
								</v-row>
								<v-row align="center" class="d-flex justify-start" no-gutters>
									<v-col cols="4" class="flex-shrink-0 flex-grow-0">
										<span class="grey--text darken-2"
											>Allow volume above 100%</span
										>
									</v-col>
									<v-col cols="2">
										<v-switch v-model="allow_earrape"> </v-switch>
									</v-col>
								</v-row>
							</v-container>
						</v-expansion-panel-content>
					</v-expansion-panel>
					<v-expansion-panel>
						<v-expansion-panel-header> Leveling </v-expansion-panel-header>
						<v-expansion-panel-content>
							<v-container fluid>
								<v-row align="center" class="d-flex justify-start" no-gutters>
									<v-col cols="4" class="flex-shrink-0 flex-grow-0">
										<span class="grey--text darken-2">Disabled Channels</span>
									</v-col>
									<v-col
										cols="8"
										style="min-width: 100px"
										class="flex-shrink-1 flex-grow-0"
									>
										<v-autocomplete
											v-model="xp_disabled_channels"
											:items="getTextChannelsRaw()"
											outlined
											dense
											label="Disabled Channels"
											multiple
										>
											<template #selection="{ item }">
												<v-chip :color="item.color" small outlined>
													{{ item.text }}
												</v-chip>
											</template>
										</v-autocomplete>
									</v-col>
								</v-row>
							</v-container>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
				<v-divider class="my-4"></v-divider>
				<v-btn
					class="mx-2"
					:disabled="has_updated ? false : true"
					@click="updateGuild()"
					color="success"
				>
					Save
				</v-btn>
			</Wrapper>
		</div>
	</div>
</template>

<script>
import ErrorMessage from "@/components/ErrorMessage.vue";
import Wrapper from "@/components/Wrapper.vue";
import axios from "axios";
var json_bigint = require("json-bigint");
var _ = require("lodash");

import { backend_url, logout } from "@/api/api.js";
import Vue from "vue";
export default {
	name: "GuildView",
	components: {
		ErrorMessage,
		Wrapper,
	},
	computed: {
		dj_roles: {
			get() {
				return this.data.data.dj_roles
					? this.data.data.dj_roles.map((x) => x.toString())
					: null;
			},
			set(val) {
				this.data.data.dj_roles = val;
				this.changed_data.dj_roles = val;
				this.checkUpdate();
			},
		},
		xp_disabled_channels: {
			get() {
				return this.data.data.no_xp_channels
					? this.data.data.no_xp_channels.map((x) => x.toString())
					: null;
			},
			set(val) {
				this.data.data["no_xp_channels"] = val;
				this.changed_data["no_xp_channels"] = val;
				this.checkUpdate();
			},
		},
		log_channel: {
			get() {
				return this.data.data.log_channel
					? this.data.data.log_channel.toString()
					: "0";
			},
			set(val) {
				this.data.data["log_channel"] = val;
				this.changed_data["log_channel"] = val;
				this.checkUpdate();
			},
		},
		allow_earrape: {
			get() {
				return this.data.data.allow_earrape
					? this.data.data.allow_earrape
					: false;
			},
			set(val) {
				this.data.data["allow_earrape"] = val;
				this.changed_data["allow_earrape"] = val;
				this.checkUpdate();
			},
		},
	},
	methods: {
		async updateGuild() {
			this.loading = true;
			this.received_data = json_bigint.parse(json_bigint.stringify(this.data));
			this.checkUpdate();
			const token = localStorage.getItem("token");
			const config = {
				headers: {
					authorization: `Token ${token}`,
				},
			};
			const body = { guild: this.guild_id, data: this.changed_data };
			try {
				await axios.post(`${backend_url}/modifyguild`, body, config);
				this.changed_data = {};
				this.loading = false;
			} catch (error) {
				this.loading = false;
				this.error = true;
				this.error_message = `An unknown error occurred`;
				if (error.response) {
					if (error.response.status == 401) {
						logout();
						return;
					}
					const data = error.response.data;
					this.error_message = `Backend returned error ${data.code}: ${data.message}`;
				}
			}
		},
		getTextChannels() {
			if (this.data == null) return null;
			let data = [{ text: "None", value: "0" }];
			for (const channel of this.data.guild.channels) {
				if (channel.type != 0) continue;
				data.push({ text: `#${channel.name}`, value: channel.id.valueOf() });
			}
			return data;
		},
		getRoles() {
			if (this.data == null) return null;
			let data = [];
			for (const role of this.data.guild.roles) {
				if (!String(role.id).localeCompare(String(this.data.guild.id)))
					continue;
				data.push({
					text: `${role.name}`,
					value: role.id.toString(),
					color: `#${role.color.toString(16)}`,
				});
			}
			return data;
		},
		getTextChannelsRaw() {
			if (this.data == null) return null;
			let data = [];
			for (const channel of this.data.guild.channels) {
				if (channel.type != 0) continue;
				data.push({ text: `#${channel.name}`, value: channel.id.valueOf() });
			}
			return data;
		},
		checkUpdate() {
			if (_.isEqual(this.data.data, this.received_data.data)) {
				this.has_updated = false;
			} else {
				this.has_updated = true;
			}
		},
	},
	data() {
		return {
			items: [
				{
					text: "Dashboard",
					disabled: false,
					href: "/dashboard",
				},
			],
			guild_id: null,
			loading: false,
			error: false,
			error_message: null,
			data: null,
			received_data: null,
			changed_data: {},
			has_updated: false,
			log_channel_id: null,
		};
	},
	async mounted() {
		this.guild_id = this.$route.query.id;
		if (localStorage.getItem("token")) {
			this.loading = true;
			const token = localStorage.getItem("token");
			const config = {
				headers: {
					authorization: `Token ${token}`,
					guild_id: this.guild_id,
				},
				transformResponse: (res) => {
					return json_bigint.parse(res);
				},
			};
			try {
				const response = await axios.get(`${backend_url}/guild`, config);
				if (!response.data.data) {
					const discord_error = response.data.code ? true : false;
					const httpCode = response.data.http_code;
					let errmsg = "";
					if (discord_error) {
						errmsg = `Discord returned error ${httpCode}: ${response.data.code} - ${response.data.message}`;
					} else {
						errmsg = `Discord returned error ${httpCode}!`;
					}
					this.error = true;
					this.error_message = errmsg;
					this.loading = false;
					return;
				}
				this.data = response.data;
				this.received_data = json_bigint.parse(
					json_bigint.stringify(this.data)
				);
				this.log_channel_id = this.data.data.log_channel
					? this.data.data.log_channel
					: "0";
				Vue.set(this.items, 1, {
					text: this.data.guild.name,
					disabled: false,
					href: `${this.$router.currentRoute.path}?id=${this.$route.query.id}`,
				});
				this.loading = false;
			} catch (error) {
				console.log(error);
				this.error = true;
				this.error_message = `An unknown error occurred`;
				if (error.response) {
					const data = error.response.data;
					this.error_message = `Backend returned error ${data.code}: ${data.message}`;
				}
			}
			this.loading = false;
		}
	},
};
</script>
