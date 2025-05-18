// 用户角色常量
export const USER_ROLES = {
  WORKER: 0, // 工人/求职者
  EMPLOYER: 1, // 雇主/企业
  ADMIN: 2 // 管理员
}

// 用户角色名称
export const USER_ROLE_NAMES = {
  [USER_ROLES.WORKER]: '求职者',
  [USER_ROLES.EMPLOYER]: '雇主',
  [USER_ROLES.ADMIN]: '管理员'
}

// 根据角色ID获取角色名称
export function getRoleName(roleId: number | string | undefined): string {
  if (roleId === undefined) return '未知';
  const id = Number(roleId);
  return USER_ROLE_NAMES[id] || '未知';
} 