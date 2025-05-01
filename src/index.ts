import { WorkerEntrypoint } from "cloudflare:workers"
import type { EventName } from "@workos-inc/node"
import type {
	CreateOrganizationMembershipOptions,
	CreateOrganizationOptions,
	CreateOrganizationRequestOptions,
	CreateUserOptions,
	OrganizationMembershipStatus,
	UpdateOrganizationMembershipOptions,
	UpdateOrganizationOptions,
	UpdateUserOptions
} from "@workos-inc/node"
import { ProxyToSelf } from "workers-mcp"
import { listEvents } from "./workos/events"
import {
	createOrganizationMembership,
	deactivateOrganizationMembership,
	deleteOrganizationMembership,
	getOrganizationMembership,
	listOrganizationMemberships,
	reactivateOrganizationMembership,
	updateOrganizationMembership
} from "./workos/memberships"
import {
	createOrganization,
	deleteOrganization,
	getOrganization,
	listOrganizations,
	updateOrganization
} from "./workos/organizations"
import { listOrganizationRoles } from "./workos/roles"
import {
	createUser,
	deleteUser,
	getUser,
	listIdentities,
	listUsers,
	updateUser
} from "./workos/users"

export default class MyWorker extends WorkerEntrypoint<Env> {
	/**
	 * @ignore
	 **/
	async fetch(request: Request): Promise<Response> {
		return new ProxyToSelf(this).fetch(request)
	}

	/**
	 * List events from the WorkOS API.
	 * @param events {string} JSON string array of event types to filter by. Format: ["user.created", "user.deleted"]
	 * @param rangeStart {string} Optional timestamp to get events from.
	 * @param rangeEnd {string} Optional timestamp to get events until.
	 * @param limit {number} Optional limit on number of events to return.
	 * @param after {string} Optional cursor for pagination.
	 * @param organizationId {string} Optional organization ID to filter by.
	 * @return {Promise<any>} List of events matching the criteria.
	 */
	async listEvents(
		events: string,
		rangeStart?: string,
		rangeEnd?: string,
		limit?: number,
		after?: string,
		organizationId?: string
	) {
		// Parse the JSON string to get the array of event types
		const parsedEvents = JSON.parse(events) as EventName[]

		return await listEvents(
			this.env,
			parsedEvents,
			rangeStart,
			rangeEnd,
			limit,
			after,
			organizationId
		)
	}

	/**
	 * List organizations from the WorkOS API.
	 * @param domains {string} Optional JSON string array of domains to filter by. Format: ["example.com", "example.org"]
	 * @param limit {number} Optional limit on number of organizations to return (1-100, default 10).
	 * @param before {string} Optional cursor for pagination (getting previous results).
	 * @param after {string} Optional cursor for pagination (getting next results).
	 * @return {Promise<any>} List of organizations matching the criteria, including pagination metadata and organization objects with the following properties:
	 *  - id {string} - The organization's unique identifier
	 *  - name {string} - The organization's name
	 *  - allowProfilesOutsideOrganization {boolean} - Whether to allow profiles outside the organization
	 *  - domains {Array} - Array of domain objects associated with the organization
	 *  - stripeCustomerId {string|undefined} - Optional Stripe customer ID
	 *  - createdAt {string} - ISO timestamp of creation
	 *  - updatedAt {string} - ISO timestamp of last update
	 */
	async listOrganizations(
		domains?: string,
		limit?: number,
		before?: string,
		after?: string
	) {
		// Parse the JSON string to get the array of domains if provided
		const parsedDomains = domains
			? (JSON.parse(domains) as string[])
			: undefined

		return await listOrganizations(
			this.env,
			parsedDomains,
			limit,
			before,
			after
		)
	}

	/**
	 * Create a new organization in WorkOS.
	 * @param payload {string} JSON string with organization details. Format:
	 *  {
	 *    "name": "Acme Inc.", // Required: The organization's name
	 *    "domains": ["example.com"], // Optional: Array of domains to associate with the organization
	 *    "allowProfilesOutsideOrganization": false, // Optional: Whether to allow profiles outside of the organization (default: false)
	 *    "idempotencyKey": "unique-key-123" // Optional: A unique key to prevent duplicate organizations
	 *  }
	 * @param requestOptions {string} Optional JSON string with request options. Format:
	 *  {
	 *    "idempotencyKey": "unique-key-123" // Optional: A unique key to prevent duplicate requests
	 *  }
	 * @return {Promise<any>} The created organization with the following properties:
	 *  - id {string} - The organization's unique identifier
	 *  - name {string} - The organization's name
	 *  - allowProfilesOutsideOrganization {boolean} - Whether profiles outside the organization are allowed
	 *  - domains {Array} - Array of domain objects associated with the organization
	 *  - stripeCustomerId {string|undefined} - Optional Stripe customer ID
	 *  - createdAt {string} - ISO timestamp of creation
	 *  - updatedAt {string} - ISO timestamp of last update
	 */
	async createOrganization(payload: string, requestOptions?: string) {
		// Parse the JSON strings
		const parsedPayload = JSON.parse(payload) as CreateOrganizationOptions
		const parsedRequestOptions = requestOptions
			? (JSON.parse(requestOptions) as CreateOrganizationRequestOptions)
			: undefined

		return await createOrganization(
			this.env,
			parsedPayload,
			parsedRequestOptions
		)
	}

	/**
	 * Delete an organization from WorkOS.
	 * @param id {string} The ID of the organization to delete (format: "org_...").
	 * @return {Promise<any>} Confirmation of deletion with success status and the deleted organization ID.
	 */
	async deleteOrganization(id: string) {
		return await deleteOrganization(this.env, id)
	}

	/**
	 * Get an organization from WorkOS by ID.
	 * @param id {string} The ID of the organization to retrieve (format: "org_...").
	 * @return {Promise<any>} The organization details with the following properties:
	 *  - id {string} - The organization's unique identifier
	 *  - name {string} - The organization's name
	 *  - allowProfilesOutsideOrganization {boolean} - Whether profiles outside the organization are allowed
	 *  - domains {Array} - Array of domain objects associated with the organization
	 *  - stripeCustomerId {string|undefined} - Optional Stripe customer ID
	 *  - createdAt {string} - ISO timestamp of creation
	 *  - updatedAt {string} - ISO timestamp of last update
	 */
	async getOrganization(id: string) {
		return await getOrganization(this.env, id)
	}

	/**
	 * Update an organization in WorkOS.
	 * @param options {string} JSON string with update options. Format:
	 *  {
	 *    "organizationId": "org_123", // Required: The ID of the organization to update
	 *    "name": "New Name", // Optional: New name for the organization
	 *    "domains": ["new-domain.com"], // Optional: New array of domains (replaces existing domains)
	 *    "allowProfilesOutsideOrganization": true // Optional: Whether to allow profiles outside of the organization
	 *  }
	 * @return {Promise<any>} The updated organization with the following properties:
	 *  - id {string} - The organization's unique identifier
	 *  - name {string} - The organization's name (updated if changed)
	 *  - allowProfilesOutsideOrganization {boolean} - Whether profiles outside the organization are allowed (updated if changed)
	 *  - domains {Array} - Array of domain objects associated with the organization (updated if changed)
	 *  - stripeCustomerId {string|undefined} - Optional Stripe customer ID
	 *  - createdAt {string} - ISO timestamp of creation
	 *  - updatedAt {string} - ISO timestamp of last update
	 */
	async updateOrganization(options: string) {
		// Parse the JSON string
		const parsedOptions = JSON.parse(options) as UpdateOrganizationOptions

		return await updateOrganization(this.env, parsedOptions)
	}

	/**
	 * List roles for an organization in WorkOS.
	 * @param organizationId {string} The ID of the organization to list roles for (format: "org_...").
	 * @param limit {number} Optional limit on number of roles to return (1-100, default 10).
	 * @param after {string} Optional cursor for pagination (getting next results).
	 * @param before {string} Optional cursor for pagination (getting previous results).
	 * @return {Promise<any>} List of roles for the organization, including pagination metadata and role objects with:
	 *  - id {string} - The role's unique identifier
	 *  - name {string} - The role's name
	 *  - description {string} - Description of the role
	 *  - permissions {Array} - Array of permission strings associated with the role
	 *  - createdAt {string} - ISO timestamp of creation
	 *  - updatedAt {string} - ISO timestamp of last update
	 */
	async listOrganizationRoles(
		organizationId: string,
		limit?: number,
		after?: string,
		before?: string
	) {
		return await listOrganizationRoles(
			this.env,
			organizationId,
			limit,
			after,
			before
		)
	}

	/**
	 * List users from the WorkOS API.
	 * @param email {string} Optional email to filter users by.
	 * @param organizationId {string} Optional organization ID to filter users by.
	 * @param limit {number} Optional limit on number of users to return (1-100, default 10).
	 * @param before {string} Optional cursor for pagination (getting previous results).
	 * @param after {string} Optional cursor for pagination (getting next results).
	 * @return {Promise<any>} List of users matching the criteria, including pagination metadata and user objects with:
	 *  - id {string} - The user's unique identifier
	 *  - email {string} - The user's email address
	 *  - emailVerified {boolean} - Whether the email has been verified
	 *  - firstName {string|null} - The user's first name, if provided
	 *  - lastName {string|null} - The user's last name, if provided
	 *  - profilePictureUrl {string|null} - URL to the user's profile picture, if available
	 *  - lastSignInAt {string|null} - ISO timestamp of the user's last sign-in
	 *  - createdAt {string} - ISO timestamp of creation
	 *  - updatedAt {string} - ISO timestamp of last update
	 */
	async listUsers(
		email?: string,
		organizationId?: string,
		limit?: number,
		before?: string,
		after?: string
	) {
		return await listUsers(
			this.env,
			email,
			organizationId,
			limit,
			before,
			after
		)
	}

	/**
	 * Get a user from the WorkOS API by ID.
	 * @param userId {string} The ID of the user to retrieve (format: "user_...").
	 * @return {Promise<any>} The user details with the following properties:
	 *  - id {string} - The user's unique identifier
	 *  - email {string} - The user's email address
	 *  - emailVerified {boolean} - Whether the email has been verified
	 *  - firstName {string|null} - The user's first name, if provided
	 *  - lastName {string|null} - The user's last name, if provided
	 *  - profilePictureUrl {string|null} - URL to the user's profile picture, if available
	 *  - lastSignInAt {string|null} - ISO timestamp of the user's last sign-in
	 *  - createdAt {string} - ISO timestamp of creation
	 *  - updatedAt {string} - ISO timestamp of last update
	 */
	async getUser(userId: string) {
		return await getUser(this.env, userId)
	}

	/**
	 * Create a new user in WorkOS.
	 * @param payload {string} JSON string with user details. Format:
	 *  {
	 *    "email": "user@example.com", // Required: The user's email address
	 *    "password": "securepassword", // Optional: Password for the user
	 *    "firstName": "John", // Optional: User's first name
	 *    "lastName": "Doe", // Optional: User's last name
	 *    "emailVerified": true // Optional: Whether the email should be marked as verified (default: false)
	 *  }
	 * @return {Promise<any>} The created user with the following properties:
	 *  - id {string} - The user's unique identifier
	 *  - email {string} - The user's email address
	 *  - emailVerified {boolean} - Whether the email has been verified
	 *  - firstName {string|null} - The user's first name, if provided
	 *  - lastName {string|null} - The user's last name, if provided
	 *  - profilePictureUrl {string|null} - URL to the user's profile picture, if available
	 *  - lastSignInAt {string|null} - ISO timestamp of the user's last sign-in
	 *  - createdAt {string} - ISO timestamp of creation
	 *  - updatedAt {string} - ISO timestamp of last update
	 */
	async createUser(payload: string) {
		// Parse the JSON string
		const parsedPayload = JSON.parse(payload) as CreateUserOptions

		return await createUser(this.env, parsedPayload)
	}

	/**
	 * Update a user in WorkOS.
	 * @param options {string} JSON string with update options. Format:
	 *  {
	 *    "userId": "user_123", // Required: The ID of the user to update
	 *    "firstName": "New Name", // Optional: New first name for the user
	 *    "lastName": "New Last Name", // Optional: New last name for the user
	 *    "emailVerified": true, // Optional: Whether the email should be marked as verified
	 *    "password": "newpassword" // Optional: New password for the user
	 *  }
	 * @return {Promise<any>} The updated user with the following properties:
	 *  - id {string} - The user's unique identifier
	 *  - email {string} - The user's email address
	 *  - emailVerified {boolean} - Whether the email has been verified (updated if changed)
	 *  - firstName {string|null} - The user's first name (updated if changed)
	 *  - lastName {string|null} - The user's last name (updated if changed)
	 *  - profilePictureUrl {string|null} - URL to the user's profile picture, if available
	 *  - lastSignInAt {string|null} - ISO timestamp of the user's last sign-in
	 *  - createdAt {string} - ISO timestamp of creation
	 *  - updatedAt {string} - ISO timestamp of last update
	 */
	async updateUser(options: string) {
		// Parse the JSON string
		const parsedOptions = JSON.parse(options) as UpdateUserOptions

		return await updateUser(this.env, parsedOptions)
	}

	/**
	 * Delete a user from WorkOS.
	 * @param userId {string} The ID of the user to delete (format: "user_...").
	 * @return {Promise<any>} Confirmation of deletion with success status and the deleted user ID.
	 */
	async deleteUser(userId: string) {
		return await deleteUser(this.env, userId)
	}

	/**
	 * List identities for a user in WorkOS.
	 * @param userId {string} The ID of the user to list identities for (format: "user_...").
	 * @return {Promise<any>} List of identities for the user.
	 */
	async listIdentities(userId: string) {
		return await listIdentities(this.env, userId)
	}

	/**
	 * Get an organization membership from WorkOS by ID.
	 * @param membershipId {string} The ID of the organization membership to retrieve (format: "om_...").
	 * @return {Promise<any>} The organization membership details with the following properties:
	 *  - id {string} - The membership's unique identifier
	 *  - organizationId {string} - The ID of the organization
	 *  - userId {string} - The ID of the user
	 *  - status {string} - The status of the membership (active, inactive, or pending)
	 *  - role {object} - The role assigned to the user in the organization
	 *  - createdAt {string} - ISO timestamp of creation
	 *  - updatedAt {string} - ISO timestamp of last update
	 */
	async getOrganizationMembership(membershipId: string) {
		return await getOrganizationMembership(this.env, membershipId)
	}

	/**
	 * List organization memberships from the WorkOS API.
	 * @param organizationId {string} Optional organization ID to filter memberships by.
	 * @param userId {string} Optional user ID to filter memberships by.
	 * @param statuses {string} Optional JSON string array of statuses to filter by. Format: ["active", "inactive", "pending"]
	 * @param limit {number} Optional limit on number of memberships to return (1-100, default 10).
	 * @param before {string} Optional cursor for pagination (getting previous results).
	 * @param after {string} Optional cursor for pagination (getting next results).
	 * @return {Promise<any>} List of organization memberships matching the criteria.
	 */
	async listOrganizationMemberships(
		organizationId?: string,
		userId?: string,
		statuses?: string,
		limit?: number,
		before?: string,
		after?: string
	) {
		// Parse the JSON string to get the array of statuses if provided
		const parsedStatuses = statuses
			? (JSON.parse(statuses) as string[])
			: undefined

		return await listOrganizationMemberships(
			this.env,
			organizationId,
			userId,
			parsedStatuses,
			limit,
			before,
			after
		)
	}

	/**
	 * Create a new organization membership in WorkOS.
	 * @param payload {string} JSON string with membership details. Format:
	 *  {
	 *    "organizationId": "org_123", // Required: The ID of the organization
	 *    "userId": "user_123", // Required: The ID of the user
	 *    "roleSlug": "admin" // Optional: The slug of the role to assign to the user
	 *  }
	 * @return {Promise<any>} The created organization membership.
	 */
	async createOrganizationMembership(payload: string) {
		// Parse the JSON string
		const parsedPayload = JSON.parse(
			payload
		) as CreateOrganizationMembershipOptions

		return await createOrganizationMembership(this.env, parsedPayload)
	}

	/**
	 * Update an organization membership in WorkOS.
	 * @param membershipId {string} The ID of the organization membership to update (format: "om_...").
	 * @param options {string} JSON string with update options. Format:
	 *  {
	 *    "roleSlug": "admin" // Optional: The new role slug to assign to the user
	 *  }
	 * @return {Promise<any>} The updated organization membership.
	 */
	async updateOrganizationMembership(membershipId: string, options: string) {
		// Parse the JSON string
		const parsedOptions = JSON.parse(
			options
		) as UpdateOrganizationMembershipOptions

		return await updateOrganizationMembership(
			this.env,
			membershipId,
			parsedOptions
		)
	}

	/**
	 * Delete an organization membership from WorkOS.
	 * @param membershipId {string} The ID of the organization membership to delete (format: "om_...").
	 * @return {Promise<any>} Confirmation of deletion with success status and the deleted membership ID.
	 */
	async deleteOrganizationMembership(membershipId: string) {
		return await deleteOrganizationMembership(this.env, membershipId)
	}

	/**
	 * Deactivate an organization membership in WorkOS.
	 * @param membershipId {string} The ID of the organization membership to deactivate (format: "om_...").
	 * @return {Promise<any>} The deactivated organization membership with status set to "inactive".
	 */
	async deactivateOrganizationMembership(membershipId: string) {
		return await deactivateOrganizationMembership(this.env, membershipId)
	}

	/**
	 * Reactivate an organization membership in WorkOS.
	 * @param membershipId {string} The ID of the organization membership to reactivate (format: "om_...").
	 * @return {Promise<any>} The reactivated organization membership with status set to "active".
	 */
	async reactivateOrganizationMembership(membershipId: string) {
		return await reactivateOrganizationMembership(this.env, membershipId)
	}
}

