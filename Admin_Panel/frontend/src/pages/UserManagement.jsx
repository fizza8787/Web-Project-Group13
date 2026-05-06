import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser, deleteUser, fetchUsers, toggleUserStatus, updateUser } from "../store/slices/adminSlice";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, error } = useSelector((state) => state.admin);
  const [keyword, setKeyword] = useState("");
  const [role, setRole] = useState("");
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "client" });

  useEffect(() => {
    const id = setTimeout(() => {
      dispatch(fetchUsers({ keyword, role }));
    }, 400);
    return () => clearTimeout(id);
  }, [dispatch, keyword, role]);

  const onDelete = (id) => {
    if (window.confirm("Delete this user permanently?")) {
      dispatch(deleteUser(id));
    }
  };

  const onCreate = (e) => {
    e.preventDefault();
    dispatch(createUser(newUser));
    setNewUser({ name: "", email: "", password: "", role: "client" });
  };

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <form onSubmit={onCreate} className="mb-4 grid gap-2 rounded-lg border border-slate-800 bg-slate-950 p-3 md:grid-cols-5">
        <input
          required
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          placeholder="Name"
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
        />
        <input
          required
          type="email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          placeholder="Email"
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
        />
        <input
          required
          type="password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          placeholder="Password"
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
        >
          <option value="client">Client</option>
          <option value="freelancer">Freelancer</option>
          <option value="admin">Admin</option>
        </select>
        <button className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700">Create User</button>
      </form>

      <div className="mb-4 flex flex-col gap-3 md:flex-row">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search users by name or email"
          className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
        >
          <option value="">All roles</option>
          <option value="client">Client</option>
          <option value="freelancer">Freelancer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="pb-2">Name</th>
              <th className="pb-2">Email</th>
              <th className="pb-2">Role</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-slate-800/70">
                <td className="py-3 text-white">{user.name}</td>
                <td className="py-3 text-slate-300">{user.email}</td>
                <td className="py-3 capitalize text-slate-300">{user.role}</td>
                <td className={`py-3 ${user.isActive ? "text-emerald-400" : "text-red-400"}`}>
                  {user.isActive ? "Active" : "Banned"}
                </td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        dispatch(
                          updateUser({
                            id: user._id,
                            payload: { role: user.role === "client" ? "freelancer" : user.role === "freelancer" ? "admin" : "client" }
                          })
                        )
                      }
                      className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700"
                    >
                      Rotate Role
                    </button>
                    <button
                      onClick={() => dispatch(toggleUserStatus(user._id))}
                      className="rounded-md bg-amber-600 px-3 py-1 text-xs font-medium text-white hover:bg-amber-700"
                    >
                      {user.isActive ? "Ban" : "Unban"}
                    </button>
                    <button
                      onClick={() => onDelete(user._id)}
                      className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default UserManagement;
