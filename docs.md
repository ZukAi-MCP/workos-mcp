Title: API Reference – WorkOS Docs

Events
------

[](https://workos.com/docs/reference/events)

Events represent activity that has occurred within WorkOS or within third-party identity and directory providers. They are used to keep your app in sync with WorkOS data. For more details on consuming events in your app, check out the [data syncing](https://workos.com/docs/events/data-syncing) guide.

Refer to the [Events](https://workos.com/docs/events) page for a full list of events that WorkOS emits.

List events
-----------

[](https://workos.com/docs/reference/events/list)

Get a list of all of events up to 30 days old.

#### `Parameters`

#### `Returns ``object`

Organization
------------

[](https://workos.com/docs/reference/organization)

An Organization is a top-level resource in WorkOS. Each Connection, Directory, and Audit Trail Event belongs to an Organization. An Organization will usually represent one of your customers.

### `organization`

Get an Organization
-------------------

[](https://workos.com/docs/reference/organization/get)

Get the details of an existing organization.

#### `Parameters`

#### `Returns`

List Organizations
------------------

[](https://workos.com/docs/reference/organization/list)

Get a list of all of your existing organizations matching the criteria specified.

#### `Parameters`

#### `Returns ``object`

Create an Organization
----------------------

[](https://workos.com/docs/reference/organization/create)

Creates a new organization in the current environment.

You can include one or more domains to associate with the organization, but you should [verify the ownership](https://workos.com/docs/user-management/domain-verification) of every domain before setting its state to `verified`.

#### `Parameters`

#### `Returns`

Update an Organization
----------------------

[](https://workos.com/docs/reference/organization/update)

Updates an organization in the current environment.

You can include one or more domains to associate with the organization, but you should [verify the ownership](https://workos.com/docs/user-management/domain-verification) of every domain before setting its state to `verified`.

#### `Parameters`

#### `Returns`

Delete an Organization
----------------------

[](https://workos.com/docs/reference/organization/delete)

Permanently deletes an organization in the current environment. It cannot be undone.

#### `Parameters`

Organization Domain
-------------------

[](https://workos.com/docs/reference/organization-domain)

An Organization Domain (also known as a User Email Domain) represents an [Organization](https://workos.com/docs/reference/organization)’s domain.

These domains restrict which email addresses are able to sign in through SAML Connections when [allow profiles outside organization](https://workos.com/docs/reference/organization) is `false`. This is the default behavior for Organizations. See [SSO frequently asked questions](https://workos.com/docs/sso/launch-checklist/frequently-asked-questions) for more details on this behavior.

Organization domains can be verified manually (through the API or the Dashboard), or through [a self-serve flow](https://workos.com/docs/domain-verification) through the Admin Portal. The organization that defines this domain policy exerts authentication policy control over that domain across your application. For this reason, it is important to verify ownership of manually added domains. Additionally, WorkOS does not allow addition of common consumer domains, like `gmail.com`.

Example Organization Domain

### `organization_domain`

List roles for an organization
------------------------------

[](https://workos.com/docs/reference/roles/list-for-organization)

Get a list of all roles for the provided organization in priority order. Includes all environment and organization roles.

`GET`

### `/organizations/:organization_id/roles`

#### `Returns ``object`

User Management
---------------

[](https://workos.com/docs/reference/user-management)

A set of user authentication and organization security features designed to provide a fast, scalable integration while handling all of the user management complexity that comes with advanced business and customer needs.

To automatically respond to User Management activities, like authentication and changes related to the users, use the corresponding [events](https://workos.com/docs/events).

User
----

[](https://workos.com/docs/reference/user-management/user)

Represents a user identity in your application. A user can sign up in your application directly with a method like password, or they can be [JIT-provisioned](https://workos.com/docs/user-management/jit-provisioning) through an organization’s SSO connection.

Users may belong to [organizations](https://workos.com/docs/reference/organization) as members.

See the [events reference](https://workos.com/docs/events/user) documentation for the user events.

### `user`

Get a user
----------

[](https://workos.com/docs/reference/user-management/user/get)

Get the details of an existing user.

`GET`

### `/user_management/users/:id`

#### `Parameters`

#### `Returns`

List users
----------

[](https://workos.com/docs/reference/user-management/user/list)

Get a list of all of your existing users matching the criteria specified.

`GET`

### `/user_management/users`

#### `Parameters`

#### `Returns ``object`

Create a user
-------------

[](https://workos.com/docs/reference/user-management/user/create)

Create a new user in the current environment.

`POST`

### `/user_management/users`

#### `Parameters`

#### `Returns`

Update a user
-------------

[](https://workos.com/docs/reference/user-management/user/update)

Updates properties of a user. The omitted properties will be left unchanged.

`PUT`

### `/user_management/users/:id`

#### `Parameters`

#### `Returns`

Delete a user
-------------

[](https://workos.com/docs/reference/user-management/user/delete)

Permanently deletes a user in the current environment. It cannot be undone.

`DELETE`

### `/user_management/users/:id`

#### `Parameters`

Identities
----------

[](https://workos.com/docs/reference/user-management/identity)

Represents [User](https://workos.com/docs/reference/user-management/user) identities obtained from external identity providers.

When a user authenticates using an external provider like [Google OAuth](https://workos.com/docs/integrations/google-oauth), information from that provider will be made available as one of the user’s Identities. You can read more about the process in our [identity linking guide](https://workos.com/docs/user-management/identity-linking).

Applications should check the `type` before making assumptions about the shape of the identity. Currently only `OAuth` identities are supported, but more types may be added in the future.

### `identity`

Get user identities
-------------------

[](https://workos.com/docs/reference/user-management/identity/list)

Get a list of identities associated with the user. A user can have multiple associated identities after going through [identity linking](https://workos.com/docs/user-management/identity-linking). Currently only OAuth identities are supported. More provider types may be added in the future.

`GET`

### `/user_management/users/:id/identities`

#### `Parameters`

#### `Returns`

Authentication
--------------

[](https://workos.com/docs/reference/user-management/authentication)

Authenticate a user with a specified authentication method.

Get an authorization URL
------------------------

[](https://workos.com/docs/reference/user-management/authentication/get-authorization-url)

Generates an OAuth 2.0 authorization URL to authenticate a user with AuthKit or SSO.

`GET`

### `/user_management/authorize`

#### `Returns`

If you are using AuthKit, set the provider parameter to `"authkit"`, which will generate an authorization URL for your AuthKit domain. AuthKit will take care of detecting the user’s authentication method, such as identifying whether they use Email + Password or Single Sign-On,and direct them to the corresponding login flow.

Otherwise, to generate an authorization URL for a WorkOS SSO connection, you’ll have to specify the user’s connection, organization, or OAuth provider as a parameter. These connection selectors are mutually exclusive, and exactly one must be provided. The generated URL automatically directs the user to their identity provider. Once the user authenticates with their identity provider, WorkOS then issues a redirect to your redirect URI to complete the sign-in flow.

### Redirect URI

In the [OAuth 2.0](https://workos.com/docs/glossary/oauth-2-0) protocol, a redirect URI is the location that the user is redirected to once they have successfully authenticated with their identity provider.

When redirecting the user, WorkOS will generate an authorization code and pass it to your redirect URI as a `code` query parameter, your app will use this code to [authenticate the user](https://workos.com/docs/reference/user-management/authentication/code). Additionally, WorkOS can pass a `state` parameter back to your application that you may use to encode arbitrary information to restore your application state between the redirects.

Redirect URI with query parameters

You can use `state` to encode parameters like originating URL and query parameters. This is useful in a flow where unauthenticated users are automatically redirected to a login page. After successful sign in, users will be routed to your redirect URI callback route. From there you can extract the originating URL from `state` and redirect the user to their intended destination.

You’ll need to configure the allowed redirect URIs for your application via the [Redirects](https://dashboard.workos.com/redirects) page in the dashboard. Without a valid redirect URI, your users will be unable to sign in. Make sure that the redirect URI you use as a parameter to get the authorization URL matches one of the redirect URIs you have configured in the dashboard.

Redirect URIs follow stricter requirements in production environments:

* `HTTPS` protocol is required in production environments

* `HTTP` and `localhost` are allowed in staging environments

* Wildcard characters are not allowed in production environments

Organization membership
-----------------------

[](https://workos.com/docs/reference/user-management/organization-membership)

An organization membership is a top-level resource that represents a [user](https://workos.com/docs/reference/user-management/user)’s relationship with an [organization](https://workos.com/docs/reference/organization). A user may be a member of zero, one, or many organizations.

See the [events reference](https://workos.com/docs/events/organization-membership) documentation for the organization membership events.

Example organization membership

### `organization_membership`

Get an organization membership
------------------------------

[](https://workos.com/docs/reference/user-management/organization-membership/get)

Get the details of an existing organization membership.

`GET`

### `/user_management/organization_memberships/:id`

#### `Parameters`

#### `Returns`

List organization memberships
-----------------------------

[](https://workos.com/docs/reference/user-management/organization-membership/list)

Get a list of all organization memberships matching the criteria specified. By default only active memberships are returned. Use the `statuses` parameter to filter by other statuses.

`GET`

### `/user_management/organization_memberships`

#### `Parameters`

#### `Returns ``object`

Create an organization membership
---------------------------------

[](https://workos.com/docs/reference/user-management/organization-membership/create)

Creates a new `active` organization membership for the given organization and user.

Calling this API with an organization and user that match an `inactive` organization membership will activate the membership with the specified role.

`POST`

### `/user_management/organization_memberships`

#### `Parameters`

#### `Returns`

Update an organization membership
---------------------------------

[](https://workos.com/docs/reference/user-management/organization-membership/update)

Update the details of an existing organization membership.

`PUT`

### `/user_management/organization_memberships/:id`

#### `Parameters`

#### `Returns`

Delete an organization membership
---------------------------------

[](https://workos.com/docs/reference/user-management/organization-membership/delete)

Permanently deletes an existing organization membership. It cannot be undone.

`DELETE`

### `/user_management/organization_memberships/:id`

#### `Parameters`

Deactivate an organization membership
-------------------------------------

[](https://workos.com/docs/reference/user-management/organization-membership/deactivate)

Deactivates an `active` organization membership. Emits an [organization\_membership.updated](https://workos.com/docs/events/organization-membership) event upon successful deactivation.

* Deactivating an `inactive` membership is a no-op and does not emit an event.

* Deactivating a `pending` membership returns an error. This membership should be [deleted](https://workos.com/docs/reference/user-management/organization-membership/delete) instead.

See the [membership management documentation](https://workos.com/docs/user-management/users-organizations/organizations/membership-management) for additional details.

`PUT`

### `/user_management/organization_memberships/:id/deactivate`

#### `Parameters`

#### `Returns`

Reactivate an organization membership
-------------------------------------

[](https://workos.com/docs/reference/user-management/organization-membership/reactivate)

Reactivates an `inactive` organization membership, retaining the pre-existing role. Emits an [organization\_membership.updated](https://workos.com/docs/events/organization-membership) event upon successful reactivation.

* Reactivating an `active` membership is a no-op and does not emit an event.

* Reactivating a `pending` membership returns an error. The user needs to [accept the invitation](https://workos.com/docs/user-management/invitations) instead.

See the [membership management documentation](https://workos.com/docs/user-management/users-organizations/organizations/membership-management) for additional details.

`PUT`

### `/user_management/organization_memberships/:id/reactivate`

#### `Parameters`

#### `Returns`

Invitation
----------

[](https://workos.com/docs/reference/user-management/invitation)

An email invitation allows the recipient to sign up for your app and join a specific [organization](https://workos.com/docs/reference/organization). When an invitation is accepted, a [user](https://workos.com/docs/reference/user-management/user) and a corresponding [organization membership](https://workos.com/docs/reference/user-management/organization-membership) are created.

Users may be invited to your app without joining an organization, or they may be invited to join an organization if they already have an account. Invitations may be also issued on behalf of another user. In this case, the invitation email will mention the name of the user who invited the recipient.

Get an invitation
-----------------

[](https://workos.com/docs/reference/user-management/invitation/get)

Get the details of an existing invitation.

`GET`

### `/user_management/invitations/:id`

#### `Parameters`

#### `Returns`

Find an invitation by token
---------------------------

[](https://workos.com/docs/reference/user-management/invitation/find-by-token)

Retrieve an existing invitation using the token.

`GET`

### `/user_management/invitations/by_token/:token`

#### `Parameters`

#### `Returns`

List invitations
----------------

[](https://workos.com/docs/reference/user-management/invitation/list)

Get a list of all of invitations matching the criteria specified.

`GET`

### `/user_management/invitations`

#### `Parameters`

#### `Returns ``object`

Send an invitation
------------------

[](https://workos.com/docs/reference/user-management/invitation/send)

Sends an invitation email to the recipient.

`POST`Sends email

### `/user_management/invitations`

#### `Parameters`

#### `Returns`

Accept an invitation
--------------------

[](https://workos.com/docs/reference/user-management/invitation/accept)

Accepts an invitation and, if linked to an organization, activates the user’s membership in that organization.

In most cases, use existing authentication methods like [`authenticateWithCode`](https://workos.com/docs/reference/user-management/authentication/code), which also accept an invitation token. These methods offer the same functionality (invitation acceptance and membership activation) while also signing the user in.

This method is useful for apps requiring a highly customized invitation flow, as it focuses solely on handling invitations without authentication. It’s also helpful when users can be invited to multiple organizations and need a way to accept invitations after signing in.

Your application should verify that the invitation is intended for the user accepting it. For example, by fetching the invitation using the [find-by-token endpoint](https://workos.com/docs/reference/user-management/invitation/find-by-token) and ensuring the email matches the email address of the accepting user.

`POST`

### `/user_management/invitations/:id/accept`

#### `Parameters`

#### `Returns`

Revoke an invitation
--------------------

[](https://workos.com/docs/reference/user-management/invitation/revoke)

Revokes an existing invitation.

`POST`

### `/user_management/invitations/:id/revoke`

#### `Parameters`

#### `Returns`

Logout
------

[](https://workos.com/docs/reference/user-management/logout)

End a user’s session. The user’s browser should be redirected to this URL.

Get logout URL
--------------

[](https://workos.com/docs/reference/user-management/logout/get-logout-url)

`GET`

### `/user_management/sessions/logout`

#### `Parameters`

#### `Returns`

Get logout URL from session cookie
----------------------------------

[](https://workos.com/docs/reference/user-management/logout/get-logout-url-from-session-cookie)

Generates the logout URL by extracting the session ID from the session cookie. Use this over `getLogoutUrl` if you don’t have a saved reference to the session ID and you’d like the SDK to handle extracting the session ID from the cookie for you.

### `userManagement.getLogoutUrlFromSessionCookie()`

#### `Parameters ``object`

#### `Returns`


Single Sign-On
--------------

[](https://workos.com/docs/reference/sso)

The Single Sign-On API has been modeled to meet the [OAuth 2.0](https://workos.com/docs/glossary/oauth-2-0) framework specification. As a result, authentication flows constructed using the Single Sign-On API replicate the OAuth 2.0 protocol flow.

To automatically respond to changes in your SSO connections, use the [Connection events](https://workos.com/docs/events/connection).

Get an authorization URL
------------------------

[](https://workos.com/docs/reference/sso/get-authorization-url)

Generates an OAuth 2.0 authorization URL to authenticate a user with SSO.

#### `Returns`

You’ll have to specify the user’s connection, organization, or OAuth provider as a parameter. These connection selectors are mutually exclusive, and exactly one must be provided. The generated URL automatically directs the user to their identity provider. Once the user authenticates with their identity provider, WorkOS then issues a redirect to your redirect URI to complete the sign-in flow.

### Redirect URI

In the [OAuth 2.0](https://workos.com/docs/glossary/oauth-2-0) protocol, a redirect URI is the location that the user is redirected to once they have successfully authenticated with their identity provider.

When redirecting the user, WorkOS will generate an authorization code and pass it to your redirect URI as a `code` query parameter, your app will use this code to [get the user’s profile](https://workos.com/docs/reference/sso/profile/get-profile-and-token). Additionally, WorkOS can pass a `state` parameter back to your application that you may use to encode arbitrary information to restore your application state between the redirects.

Redirect URI with query parameters

You’ll need to configure the allowed redirect URIs for your application via the [Redirects](https://dashboard.workos.com/redirects) page in the dashboard. Without a valid redirect URI, your users will be unable to sign in. Make sure that the redirect URI you use as a parameter to get the authorization URL matches one of the redirect URIs you have configured in the dashboard.

Redirect URIs follow stricter requirements in production environments:

* `HTTPS` protocol is required in production environments

* `HTTP` and `localhost` are allowed in staging environments

* Wildcard characters are not allowed in production environments

### Error codes

If there is an issue generating an authorization URL, the API will return the original redirect URI with `error` and `error_description` query parameters. If provided, the `state` value will also be included.

Redirect URI with an error code

Possible error codes and the corresponding descriptions are listed below.

Profile
-------

[](https://workos.com/docs/reference/sso/profile)

A Profile is an object that represents an authenticated user. The Profile object contains information relevant to a user in the form of normalized attributes.

After receiving the Profile for an authenticated user, use the Profile object attributes to persist relevant data to your application’s user model for the specific, authenticated user.

No Profile attributes can be returned other than the normalized attributes listed below.

### `profile`

Get a Profile and Token
-----------------------

[](https://workos.com/docs/reference/sso/profile/get-profile-and-token)

Get an access token along with the user [Profile](https://workos.com/docs/reference/sso/profile) using the code passed to your [Redirect URI](https://workos.com/docs/reference/sso/get-authorization-url/redirect-uri).

#### `Parameters`

#### `Returns ``object`

Get a User Profile
------------------

[](https://workos.com/docs/reference/sso/profile/get-user-profile)

Exchange an access token for a user’s [Profile](https://workos.com/docs/reference/sso/profile). Because this profile is returned in the [Get a Profile and Token endpoint](https://workos.com/docs/reference/sso/profile/get-profile-and-token) your application usually does not need to call this endpoint. It is available for any authentication flows that require an additional endpoint to retrieve a user’s profile.

#### `Parameters`

#### `Returns`

Connection
----------

[](https://workos.com/docs/reference/sso/connection)

A connection represents the relationship between WorkOS and any collection of application users. This collection of application users may include personal or enterprise identity providers. As a layer of abstraction, a WorkOS connection rests between an application and its users, separating an application from the implementation details required by specific standards like [OAuth 2.0](https://workos.com/docs/glossary/oauth-2-0) and [SAML](https://workos.com/docs/glossary/saml).

See the [events reference](https://workos.com/docs/events/connection) documentation for the connection events.

### `connection`

Get a Connection
----------------

[](https://workos.com/docs/reference/sso/connection/get)

Get the details of an existing connection.

#### `Parameters`

#### `Returns`

List Connections
----------------

[](https://workos.com/docs/reference/sso/connection/list)

Get a list of all of your existing connections matching the criteria specified.

#### `Parameters`

#### `Returns ``object`

Delete a Connection
-------------------

[](https://workos.com/docs/reference/sso/connection/delete)

Permanently deletes an existing connection. It cannot be undone.

#### `Parameters`

Directory Sync
--------------

[](https://workos.com/docs/reference/directory-sync)

Directory Sync allows you to connect with directory providers to inform your application of any changes in their users, groups, or access rules.

Using Directory Sync, one integration grants your application the ability to support multiple directory providers. Get real-time updates of any changes to the organization’s access rules, groups, and users by integrating webhooks into your application.

To automatically respond to changes in the connected directories and their users and groups, use the [Directory Sync events](https://workos.com/docs/events/directory-sync).

Directory
---------

[](https://workos.com/docs/reference/directory-sync/directory)

A directory stores information about an organization’s employee management system.

Synchronizing with a directory enables you to receive changes to an organization’s [user](https://workos.com/docs/reference/directory-sync/directory-user) and [group](https://workos.com/docs/reference/directory-sync/directory-group) structure.

Directory providers vary in implementation details and may require different sets of fields for integration, such as API keys, subdomains, endpoints, usernames, etc. Where available, the WorkOS API will provide these fields when fetching directory records.

### `directory`

Get a Directory
---------------

[](https://workos.com/docs/reference/directory-sync/directory/get)

Get the details of an existing directory.

#### `Parameters`

#### `Returns`

List Directories
----------------

[](https://workos.com/docs/reference/directory-sync/directory/list)

Get a list of all of your existing directories matching the criteria specified.

#### `Parameters`

#### `Returns ``object`

Delete a Directory
------------------

[](https://workos.com/docs/reference/directory-sync/directory/delete)

Permanently deletes an existing directory. It cannot be undone.

#### `Parameters`

Directory User
--------------

[](https://workos.com/docs/reference/directory-sync/directory-user)

A Directory User represents an active organization user.

Developers can receive [Webhooks](https://workos.com/docs/events/directory-sync) as employees are added, updated or removed, allowing for provisioning and de-provisioning Users within an application.

### `directory_user`

Get a Directory User
--------------------

[](https://workos.com/docs/reference/directory-sync/directory-user/get)

Get the details of an existing Directory User.

#### `Parameters`

#### `Returns`

List Directory Users
--------------------

[](https://workos.com/docs/reference/directory-sync/directory-user/list)

Get a list of all of existing Directory Users matching the criteria specified.

#### `Parameters`

#### `Returns ``object`

Directory Group
---------------

[](https://workos.com/docs/reference/directory-sync/directory-group)

A directory group represents an organizational unit of users in a directory provider.

### `directory_group`

Get a Directory Group
---------------------

[](https://workos.com/docs/reference/directory-sync/directory-group/get)

Get the details of an existing Directory Group.

#### `Parameters`

#### `Returns`

List Directory Groups
---------------------

[](https://workos.com/docs/reference/directory-sync/directory-group/list)

Get a list of all of existing directory groups matching the criteria specified.

#### `Parameters`

#### `Returns ``object`

Admin Portal
------------

[](https://workos.com/docs/reference/admin-portal)

The Admin Portal is a standalone application where your users can configure and manage WorkOS resources such as [Connections](https://workos.com/docs/reference/sso/connection) and [Directories](https://workos.com/docs/reference/directory-sync/directory) that are scoped to their [Organization](https://workos.com/docs/reference/organization).

Portal Link
-----------

[](https://workos.com/docs/reference/admin-portal/portal-link)

A Portal Link is a temporary endpoint to initiate an Admin Portal session. It expires five minutes after issuance.

Generate a Portal Link
----------------------

[](https://workos.com/docs/reference/admin-portal/portal-link/generate)

Generate a Portal Link scoped to an Organization.

`POST`

### `/portal/generate_link`

#### `Parameters`

#### `Returns ``object`

Provider Icons
--------------

[](https://workos.com/docs/reference/admin-portal/provider-icons)

Icons for third-party providers are available through the WorkOS CDN. These icons cover identity providers, Directory Sync, and domain verification services used within the Admin Portal.

### List Provider Icons

Get a list of all of existing provider icons.

ResourcesThe icons are also available as a Figma community file.

[Open in Figma](https://www.figma.com/community/file/1408148024751538607/provider-icons)

### Get a Provider Icon

To use an icon in your project, you can reference the CDN link directly. You can alternate between light and dark mode icons by changing the path in the URL or using CSS media queries.

You can change the icons to grayscale by adding the `filter` CSS property.

Audit Logs
----------

[](https://workos.com/docs/reference/audit-logs)

Audit Logs are a collection of events that contain information relevant to notable actions taken by users in your application. Every event in the collection contains details regarding what kind of action was taken (`action`), who performed the action (`actor`), what resources were affected by the action (`targets`), and additional details of when and where the action took place.

Create Event
------------

[](https://workos.com/docs/reference/audit-logs/create-event)

Emits an Audit Log Event.

#### `Parameters`

Audit Log Schema
----------------

[](https://workos.com/docs/reference/audit-logs/audit-log-schema)

An object representing an Audit Log Schema.

### `audit_log_schema`

Create Schema
-------------

[](https://workos.com/docs/reference/audit-logs/create-schema)

Creates a new Audit Log schema used to validate the payload of incoming Audit Log Events. If the `action` does not exist, it will also be created.

`POST`

### `/audit_logs/actions/:name/schemas`

#### `Parameters`

#### `Returns`

List Schemas
------------

[](https://workos.com/docs/reference/audit-logs/list-schemas)

Get a list of all schemas for the Audit Logs action identified by `:name`.

`GET`

### `/audit_logs/actions/:name/schemas`

#### `Parameters`

#### `Returns ``object`

List Actions
------------

[](https://workos.com/docs/reference/audit-logs/list-actions)

Get a list of all Audit Log actions in the current environment.

#### `Parameters`

#### `Returns ``object`

Audit Log Export
----------------

[](https://workos.com/docs/reference/audit-logs/audit-log-export)

An object representing an Audit Log Export.

### `audit_log_export`

Create Export
-------------

[](https://workos.com/docs/reference/audit-logs/create-export)

Create an Audit Log Export.

#### `Parameters`

#### `Returns`

Get Export
----------

[](https://workos.com/docs/reference/audit-logs/get-export)

Get an Audit Log Export.

`GET`

### `/audit_logs/exports/:id`

#### `Parameters`

#### `Returns`

The URL will expire after 10 minutes. If the export is needed again at a later time, refetching the export will regenerate the URL.

Get Retention
-------------

[](https://workos.com/docs/reference/audit-logs/get-retention)

Get the configured event retention period for the given Organization.

`GET`

### `/organizations/:id/audit_logs_retention`

#### `Parameters`

#### `Returns ``object`

Set Retention
-------------

[](https://workos.com/docs/reference/audit-logs/set-retention)

Set the event retention period for the given Organization.

`PUT`

### `/organizations/:id/audit_logs_retention`

#### `Parameters`

#### `Returns ``object`

Organization domain
-------------------

[](https://workos.com/docs/reference/domain-verification)

An organization domain represents an [organization](https://workos.com/docs/reference/organization)’s domain. Domains can be verified to assert that an organization owns the configured domain which is accomplished through DNS TXT record verification.

To automatically respond to changes in the organization domains, use [Domain Verification events](https://workos.com/docs/events/organization-domain).

Example organization domain

Get an Organization Domain
--------------------------

[](https://workos.com/docs/reference/domain-verification/get)

Get the details of an existing organization.

`GET`

### `/organization_domains/:id`

#### `Parameters`

#### `Returns`

Create an Organization Domain
-----------------------------

[](https://workos.com/docs/reference/domain-verification/create)

Creates a new Organization Domain.

`POST`

### `/organization-domains`

#### `Parameters`

#### `Returns`

Verify an Organization Domain
-----------------------------

[](https://workos.com/docs/reference/domain-verification/verify)

Initiates verification process for an Organization Domain.

`POST`

### `/organization-domains/:id/verify`

#### `Parameters`

#### `Returns`

Authentication Factor
---------------------

[](https://workos.com/docs/reference/mfa/authentication-factor)

An object representing an Authentication Factor.

Example Authentication Factor

### `authentication_factor`

Authentication Challenge
------------------------

[](https://workos.com/docs/reference/mfa/authentication-challenge)

An object representing a Challenge of an Authentication Factor.

Example Authentication Challenge

### `authentication_challenge`

Enroll Factor
-------------

[](https://workos.com/docs/reference/mfa/enroll-factor)

Enrolls an Authentication Factor to be used as an additional factor of authentication. The returned ID should be used to create an authentication Challenge.

#### `Parameters`

#### `Returns`

Challenge Factor
----------------

[](https://workos.com/docs/reference/mfa/challenge-factor)

Creates a Challenge for an Authentication Factor.

`POST`

### `/auth/factors/:id/challenge`

#### `Parameters`

#### `Returns`

Verify Challenge
----------------

[](https://workos.com/docs/reference/mfa/verify-challenge)

Verify Authentication Challenge.

`POST`

### `/auth/challenges/:id/verify`

#### `Parameters`

#### `Returns ``object`

Get Factor
----------

[](https://workos.com/docs/reference/mfa/get-factor)

Gets an Authentication Factor.

#### `Parameters`

#### `Returns`

Delete Factor
-------------

[](https://workos.com/docs/reference/mfa/delete-factor)

Permanently deletes an Authentication Factor. It cannot be undone.

#### `Parameters`

Fine-Grained Authorization
--------------------------

[](https://workos.com/docs/reference/fga)

Fine-Grained Authorization (FGA) is a set of APIs designed to help you implement scalable, centralized, fine grained authorization in your application.

Resource Type
-------------

[](https://workos.com/docs/reference/fga/resource-type)

Represents a type of resource and its possible relationships in your application.

### `resource_type`

Get a resource type
-------------------

[](https://workos.com/docs/reference/fga/resource-type/get)

Get the definition of an existing resource type.

`GET`

### `/fga/v1/resource-types/:type`

#### `Parameters`

#### `Returns`

List resource types
-------------------

[](https://workos.com/docs/reference/fga/resource-type/list)

Get a list of all your existing resource types matching the criteria specified.

`GET`

### `/fga/v1/resource-types`

#### `Parameters`

#### `Returns`

Create a resource type
----------------------

[](https://workos.com/docs/reference/fga/resource-type/create)

Create a new resource type in the current environment.

`POST`

### `/fga/v1/resource-types`

#### `Parameters`

#### `Returns`

Update a resource type
----------------------

[](https://workos.com/docs/reference/fga/resource-type/update)

Update properties of a resource type.

`PUT`

### `/fga/v1/resource-types`

#### `Parameters`

#### `Returns`

Delete a resource type
----------------------

[](https://workos.com/docs/reference/fga/resource-type/delete)

Deletes a resource type in the current environment.

`DELETE`

### `/fga/v1/resource-types/:type`

#### `Parameters`

Apply resource types
--------------------

[](https://workos.com/docs/reference/fga/resource-type/apply)

Sets resource types in the current environment to match the provided resource types.

This endpoint performs a batch operation which will override your entire schema for the environment. Any existing resource types not included in the request will be deleted.

`PUT`

### `/fga/v1/resource-types`

#### `Parameters`

#### `Returns`

Warrant
-------

[](https://workos.com/docs/reference/fga/warrant)

Represents a relation between resources in your application.

### `warrant`

List warrants
-------------

[](https://workos.com/docs/reference/fga/warrant/list)

Get a list of all your existing warrants matching the criteria specified.

#### `Parameters`

#### `Returns`

Write a warrant
---------------

[](https://workos.com/docs/reference/fga/warrant/write)

Creates or deletes a warrant in the current environment.

### Create Warrant

#### `Parameters`

#### `Returns ``object`

### Delete Warrant

#### `Parameters`

#### `Returns ``object`

Batch Write Warrants
--------------------

[](https://workos.com/docs/reference/fga/warrant/batch-write)

Executes a batch of warrant writes in the current environment.

#### `Parameters`

#### `Returns`

Resource
--------

[](https://workos.com/docs/reference/fga/resource)

Represents a resource in your application.

### `resource`

Get a resource
--------------

[](https://workos.com/docs/reference/fga/resource/get)

Get an existing resource.

`GET`

### `/fga/v1/resources/:resource_type/:resource_id`

#### `Parameters`

#### `Returns`

List resources
--------------

[](https://workos.com/docs/reference/fga/resource/list)

Get a list of all your existing resources matching the criteria specified.

#### `Parameters`

#### `Returns`

Create a resource
-----------------

[](https://workos.com/docs/reference/fga/resource/create)

Create a new resource in the current environment.

#### `Parameters`

#### `Returns`

Update a resource
-----------------

[](https://workos.com/docs/reference/fga/resource/update)

Update the meta of an existing resource in the current environment.

`PUT`

### `/fga/v1/resources/:resource_type/:resource_id`

#### `Parameters`

#### `Returns`

Delete a resource
-----------------

[](https://workos.com/docs/reference/fga/resource/delete)

Deletes a resource in the current environment.

`DELETE`

### `/fga/v1/resources/:resource_type/:resource_id`

#### `Parameters`

Batch write resources
---------------------

[](https://workos.com/docs/reference/fga/resource/batch-write)

Create or delete up to 100 resources in one request.

### Batch create resources

`POST`

### `/fga/v1/resources/batch`

#### `Parameters`

#### `Returns`

### Batch delete resources

`POST`

### `/fga/v1/resources/batch`

#### `Parameters`

#### `Returns`

Check
-----

[](https://workos.com/docs/reference/fga/check)

Check if a subject has a particular relation on a resource.

Single Check
------------

#### `Parameters`

#### `Returns ``object`

Multiple Checks
---------------

#### `Parameters`

#### `Returns ``object`

Batch Check
-----------

[](https://workos.com/docs/reference/fga/batch-check)

Executes a batch of checks and returns a list of results in a single operation.

#### `Parameters`

#### `Returns`

Query
-----

[](https://workos.com/docs/reference/fga/query)

Use the [Query Language](https://workos.com/docs/fga/query-language) to list the set of subjects that have access to a particular resource or to list the set of resources a particular subject has access to.

#### `Parameters`

#### `Returns ``object`

Widgets are React components that provide complete functionality for common enterprise app workflows.

Generate a widget token scoped to an organization and user with the specified scopes.

#### `Parameters`

#### `Returns ``object`
