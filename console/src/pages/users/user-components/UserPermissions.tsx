import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiSave, BiLockAlt } from "react-icons/bi";
import { API } from "../../../contexts/API";
import { getErrorResponse } from "../../../contexts/Callbacks";
import ToggleButton from "../../../ui/button/ToggleButton";
import type { UserProps } from "../../../types/UserProps";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../../types/Types";
import { ButtonGroup } from "../../../ui/button/Button";

export default function UserPermissions({ user }: { user: UserProps | null }) {
  const { getRoleById, startLoadingBar, stopLoadingBar } =
    useOutletContext<DashboardOutletContextProps>();
  const [allPermissions, setAllPermissions] = useState<any[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<
    Record<string, string[]>
  >({});
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const getPermissions = useCallback(async () => {
    startLoadingBar();
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
      if (applicableGroups.length) {
        setSelectedCategory(applicableGroups[0]._id);
      }

      if (user.permissions && user.permissions.length > 0) {
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
    } finally {
      stopLoadingBar();
    }
  }, [user]);

  useEffect(() => {
    getPermissions();
  }, [getPermissions]);

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

  if (allPermissions.length === 0 && !loading) {
    return (
      <div className="bg-(--primary-bg) rounded-custom shadow-custom p-6 flex flex-col items-center justify-center text-center h-100">
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
    <div className="bg-(--primary-bg) rounded-custom shadow-custom overflow-hidden flex flex-col h-150 lg:flex-row gap-2 p-6">
      <aside className="w-full lg:w-72 bg-(--secondary-bg) rounded-custom shadow-custom flex flex-col">
        <div className="p-4">
          <p className="font-bold text-(--text-color)">Permission Groups</p>
        </div>

        <div className="flex-1 overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden custom-scrollbar">
          <ul className="flex lg:flex-col min-w-max lg:min-w-0 p-1.5">
            {allPermissions.map((group) => {
              const isActive = selectedCategory === group._id;
              const count = group.permissions.length;
              const selectedCount = selectedPermissions[group._id]?.length || 0;

              return (
                <li key={group._id}>
                  <button
                    onClick={() => setSelectedCategory(group._id)}
                    className={`w-full text-left py-3 px-4 flex items-center justify-between transition-all duration-200  rounded-custom ${
                      isActive
                        ? "bg-(--main-subtle) text-(--main) font-medium shadow-custom"
                        : "bg-transparent border-transparent text-(--text-color) hover:bg-(--primary-bg) hover:text-(--text-color-emphasis)"
                    } ${"mx-1 lg:mx-0"}`}
                  >
                    <span className="truncate pr-2 capitalize">
                      {group.title}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        Number(selectedCount) > 0
                          ? "bg-(--main)/5 text-(--main)"
                          : "bg-(--gray-subtle) text-(--gray)"
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

      <main className="flex-1 flex flex-col min-h-0 bg-(--secondary-bg) rounded-custom shadow-custom">
        {allPermissions
          .filter((group) => group._id === selectedCategory)
          .map((group) => {
            const allSelected =
              selectedPermissions[group._id]?.length ===
              group.permissions.length;

            return (
              <div key={group._id} className="flex flex-col h-full">
                <div className="flex items-center justify-between px-6 py-4 shrink-0">
                  <div>
                    <h4 className="capitalize">{group.title} Access</h4>
                    <p>
                      Role:{" "}
                      <span className="font-semibold text-(--main) capitalize">
                        {user.role}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-(--text-color) font-medium hidden sm:inline">
                      Select All
                    </span>
                    <ToggleButton
                      checked={allSelected}
                      onToggle={(val) => handleSelectAllByTitle(group._id, val)}
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                  <div className="grid grid-cols-1 gap-4">
                    {group.permissions.map((perm: any, idx: number) => {
                      const isSelected =
                        selectedPermissions[group._id]?.includes(perm._id) ||
                        false;

                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-3 rounded-custom transition-all duration-200 ${
                            isSelected
                              ? "bg-(--white) shadow-custom"
                              : "bg-(--gray-subtle)/50 "
                          }`}
                        >
                          <div className="flex flex-col pr-4">
                            <span
                              className={`text-sm font-semibold capitalize ${isSelected ? "text-(--main)" : "text-(--text-color"}`}
                            >
                              {perm.title}
                            </span>
                            {perm.description && (
                              <span className="text-xs text-(--text-subtle) mt-0.5">
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

                <div className="p-4 border-t border-(--border) flex justify-end shrink-0">
                  <ButtonGroup
                    onClick={handleUpdatePermissions}
                    className="flex justify-center items-center gap-3"
                    Icon={BiSave}
                    label={loading ? "Saving..." : "Update Permissions"}
                  />
                </div>
              </div>
            );
          })}
      </main>
    </div>
  );
}
