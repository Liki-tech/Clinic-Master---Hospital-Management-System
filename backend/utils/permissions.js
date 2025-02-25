export const getPermissionsForRole = (role) => {
  const permissions = {
    admin: {
      canViewAllPatients: true,
      canManageAppointments: true,
      canManageBilling: true,
      canManageStaff: true
    },
    doctor: {
      canViewAllPatients: true,
      canManageAppointments: true,
      canViewBilling: true
    },
    staff: {
      canViewPatients: true,
      canManageAppointments: true
    }
  };
  return permissions[role] || {};
};
