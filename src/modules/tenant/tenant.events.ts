export const TenantEvents = {
  // Tenant lifecycle
  TENANT_CREATED: 'tenant.created',
  TENANT_UPDATED: 'tenant.updated',
  TENANT_DELETED: 'tenant.deleted',

  // Membership
  MEMBER_INVITED: 'tenant.member.invited',
  MEMBER_JOINED: 'tenant.member.joined',
  MEMBER_LEFT: 'tenant.member.left',
  MEMBER_REMOVED: 'tenant.member.removed',
  MEMBER_ROLE_UPDATED: 'tenant.member.role_updated',

  // Ownership
  OWNERSHIP_TRANSFERRED: 'tenant.ownership.transferred',

  // Subscription
  TENANT_SUBSCRIBED: 'tenant.subscribed',
  TENANT_UNSUBSCRIBED: 'tenant.unsubscribed',
  TENANT_PLAN_CHANGED: 'tenant.plan.changed',
} as const;

export type TenantEventName = (typeof TenantEvents)[keyof typeof TenantEvents];
