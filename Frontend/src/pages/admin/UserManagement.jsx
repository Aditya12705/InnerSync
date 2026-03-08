import styles from './UserManagement.module.scss';

const users = [
  { id: 1, name: 'Aarav Sharma', email: 'aarav@uni.edu', role: 'Student', status: 'Active' },
  { id: 2, name: 'Dia Mehta', email: 'dia@uni.edu', role: 'Student', status: 'Active' },
  { id: 3, name: 'Kabir Singh', email: 'kabir@uni.edu', role: 'Student', status: 'Suspended' },
  { id: 4, name: 'Dr. Emily Brown', email: 'emily@uni.edu', role: 'Counselor', status: 'Active' },
];

export function UserManagement() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>User Management</h1>
        <button className="btn primary">Add New User</button>
      </header>
      <div className={`card ${styles.tableCard}`}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <span className={`${styles.statusPill} ${styles[user.status.toLowerCase()]}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className={styles.actions}>
                    <button className="btn ghost">View</button>
                    <button className="btn danger">
                      {user.status === 'Suspended' ? 'Unsuspend' : 'Suspend'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}