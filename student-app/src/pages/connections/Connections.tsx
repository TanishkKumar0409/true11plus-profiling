"use client";

import { useState, useEffect, useCallback } from "react";
import ConnectionRequest from "./connection-component/ConnectionRequest";
import ConnectionsLists from "./connection-component/ConnectionsLists";
import type { UserProps } from "../../types/UserTypes";
import { API } from "../../contexts/API";
import { getErrorResponse } from "../../contexts/CallBacks";

interface ConnectionItem {
  connectionId: string;
  connectedSince: string;
  connectedUser: UserProps;
}

export default function Connections() {
  const [connections, setConnections] = useState<ConnectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConnections = useCallback(async () => {
    setLoading(true);
    try {
      const response = await API.get("/user/connect/all");
      setConnections(
        Array.isArray(response.data.connections)
          ? response.data.connections
          : [],
      );
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        <ConnectionsLists
          connections={connections}
          setConnections={setConnections}
          loading={loading}
        />
        <ConnectionRequest fetchConnections={fetchConnections} />
      </div>
    </div>
  );
}
