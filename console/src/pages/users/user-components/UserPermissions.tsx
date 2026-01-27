import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiSave, BiShield, BiLockAlt } from "react-icons/bi";
import { API } from "../../../contexts/API";
import { getErrorResponse } from "../../../contexts/Callbacks";
import ToggleButton from "../../../ui/button/ToggleButton";
import type { UserProps } from "../../../types/UserProps";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../../types/Types";

export default function UserPermissions({ user }: { user: UserProps | null }) {
  const { getRoleById } = useOutletContext<DashboardOutletContextProps>();
  const [allPermissions, setAllPermissions] = useState<any[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<
    Record<string, string[]>
  >({});
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const getPermissions = useCallback(async () => {
    if (!user || !user.role) return;

    try {
      const response = await API.get("/permissions");
      const rawData = response.data?.map((item: any) => {
        return {
          ...item,
          roles: item?.roles?.map((ro: string) => getRoleById(ro)),
        };
      });

      const userRoleId = user.role;
      const applicableGroups = rawData.filter(
        (group: any) => group.roles && group.roles.includes(userRoleId),
      );

      setAllPermissions(applicableGroups);

      // Default to first category if available
      if (applicableGroups.length) {
        setSelectedCategory(applicableGroups[0]._id);
      }

      // Pre-fill existing user permissions
      if (user.permissions && user.permissions.length > 0) {
        // Normalize to IDs
        const userPermIds = user.permissions.map((p: any) =>
          typeof p === "string" ? p : p._id,
        );

        const selected: Record<string, string[]> = {};

        applicableGroups.forEach((group: any) => {
          const matchedPerms = group.permissions
            .filter((p: any) => userPermIds.includes(p._id))
            .map((p: any) => p._id);

          if (matchedPerms.length) selected[group._id] = matchedPerms;
        });

        setSelectedPermissions(selected);
      }
    } catch (error) {
      getErrorResponse(error, true);
    }
  }, [user]);

  useEffect(() => {
    getPermissions();
  }, [getPermissions]);

  // --- 2. Handlers ---

  const handleSelectAllByTitle = (titleId: string, value: boolean) => {
    setSelectedPermissions((prev) => {
      const updated = { ...prev };
      if (value) {
        const target = allPermissions.find((p) => p._id === titleId);
        updated[titleId] = target
          ? target.permissions.map((p: any) => p._id)
          : [];
      } else {
        updated[titleId] = [];
      }
      return updated;
    });
  };

  const handleTogglePermission = (titleId: string, permissionId: string) => {
    setSelectedPermissions((prev) => {
      const prevList = prev[titleId] || [];
      const updated = prevList.includes(permissionId)
        ? prevList.filter((id) => id !== permissionId)
        : [...prevList, permissionId];
      return { ...prev, [titleId]: updated };
    });
  };

  const handleUpdatePermissions = async () => {
    try {
      setLoading(true);
      const allSelectedPerms = Object.values(selectedPermissions).flat();

      const response = await API.patch(`/user/${user?._id}/permissions`, {
        permissions: allSelectedPerms,
      });

      toast.success(
        response.data.message || "Permissions updated successfully",
      );
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  // --- Edge Case: No applicable permissions ---
  if (allPermissions.length === 0 && !loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 flex flex-col items-center justify-center text-center h-100">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
          <BiLockAlt size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-900">
          No Configurable Permissions
        </h3>
        <p className="text-gray-500 max-w-sm mt-2">
          There are no permission groups configured for the role{" "}
          <span className="font-bold text-purple-600 capitalize">
            {user?.role || "Unknown"}
          </span>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-150 lg:flex-row">
      {/* --- Sidebar (Groups) --- */}
      <aside className="w-full lg:w-72 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-white lg:bg-gray-50">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <BiShield className="text-purple-600" size={18} />
            Permission Groups
          </h3>
        </div>

        {/* Scrollable Group List */}
        <div className="flex-1 overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden custom-scrollbar">
          <ul className="flex lg:flex-col min-w-max lg:min-w-0 p-2 lg:p-0">
            {allPermissions.map((group) => {
              const isActive = selectedCategory === group._id;
              const count = group.permissions.length;
              const selectedCount = selectedPermissions[group._id]?.length || 0;

              return (
                <li key={group._id}>
                  <button
                    onClick={() => setSelectedCategory(group._id)}
                    className={`w-full text-left px-4 py-3 flex items-center justify-between transition-all duration-200 border-l-4 ${
                      isActive
                        ? "bg-white border-purple-600 shadow-sm text-purple-700 font-medium"
                        : "bg-transparent border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    } ${"lg:border-l-4 lg:border-b-0 border-b-4 border-l-0 rounded-lg lg:rounded-none mx-1 lg:mx-0"}`}
                  >
                    <span className="truncate pr-2">{group.title}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        selectedCount > 0
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {selectedCount}/{count}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* --- Main Content (Permissions) --- */}
      <main className="flex-1 flex flex-col min-h-0 bg-white">
        {allPermissions
          .filter((group) => group._id === selectedCategory)
          .map((group) => {
            const allSelected =
              selectedPermissions[group._id]?.length ===
              group.permissions.length;

            return (
              <div key={group._id} className="flex flex-col h-full">
                {/* Header: Title + Select All */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {group.title} Access
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Role:{" "}
                      <span className="font-semibold text-purple-600">
                        {user.role}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 font-medium hidden sm:inline">
                      Select All
                    </span>
                    <ToggleButton
                      checked={allSelected}
                      onToggle={(val) => handleSelectAllByTitle(group._id, val)}
                    />
                  </div>
                </div>

                {/* Permissions List */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.permissions.map((perm: any, idx: number) => {
                      const isSelected =
                        selectedPermissions[group._id]?.includes(perm._id) ||
                        false;

                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                            isSelected
                              ? "bg-purple-50 border-purple-200 shadow-sm"
                              : "bg-white border-gray-100 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex flex-col pr-4">
                            <span
                              className={`text-sm font-semibold ${isSelected ? "text-purple-800" : "text-gray-700"}`}
                            >
                              {perm.title}
                            </span>
                            {perm.description && (
                              <span className="text-xs text-gray-500 mt-0.5">
                                {perm.description}
                              </span>
                            )}
                          </div>

                          <ToggleButton
                            checked={isSelected}
                            onToggle={() =>
                              handleTogglePermission(group._id, perm._id)
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer: Save Button */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end shrink-0">
                  <button
                    disabled={loading}
                    onClick={handleUpdatePermissions}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                  >
                    {loading ? (
                      "Saving..."
                    ) : (
                      <>
                        <BiSave size={18} /> Update Permissions
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
      </main>
    </div>
  );
}
