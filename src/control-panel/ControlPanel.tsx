import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";

interface ApiKey {
  id: string;
  key: string;
  userId: string;
  credits: number;
}

interface License {
  id: string;
  apiKeyId: string;
  productId: string;
  expiresAt: string;
}

const ApiKeyPanel: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newApiKey, setNewApiKey] = useState({ userId: "", credits: 0 });

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch("/api/keys");
      if (!response.ok) throw new Error("Failed to fetch API keys");
      const data = await response.json();
      setApiKeys(data);
    } catch (error) {
      console.error("Error fetching API keys:", error);
    }
  };

  const createApiKey = async () => {
    try {
      const response = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newApiKey),
      });
      if (!response.ok) throw new Error("Failed to create API key");
      const createdKey = await response.json();
      setApiKeys([...apiKeys, createdKey]);
      setNewApiKey({ userId: "", credits: 0 });
    } catch (error) {
      console.error("Error creating API key:", error);
    }
  };

  const updateApiKey = async (id: string, data: Partial<ApiKey>) => {
    try {
      const response = await fetch(`/api/keys/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update API key");
      const updatedKey = await response.json();
      setApiKeys(apiKeys.map((key) => (key.id === id ? updatedKey : key)));
    } catch (error) {
      console.error("Error updating API key:", error);
    }
  };

  const deactivateApiKey = async (id: string) => {
    try {
      const response = await fetch(`/api/keys/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to deactivate API key");
      setApiKeys(apiKeys.filter((key) => key.id !== id));
    } catch (error) {
      console.error("Error deactivating API key:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Keys</CardTitle>
        <CardDescription>Manage your API keys</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="User ID"
              value={newApiKey.userId}
              onChange={(e) =>
                setNewApiKey({ ...newApiKey, userId: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Credits"
              value={newApiKey.credits}
              onChange={(e) =>
                setNewApiKey({
                  ...newApiKey,
                  credits: parseInt(e.target.value),
                })
              }
            />
            <Button onClick={createApiKey}>Create API Key</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell>{key.key}</TableCell>
                  <TableCell>{key.userId}</TableCell>
                  <TableCell>{key.credits}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      onClick={() =>
                        updateApiKey(key.id, { credits: key.credits + 100 })
                      }
                    >
                      Add Credits
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => deactivateApiKey(key.id)}
                    >
                      Deactivate
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

const LicensePanel: React.FC = () => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [newLicense, setNewLicense] = useState({
    apiKeyId: "",
    productId: "",
    expiresAt: "",
  });

  useEffect(() => {
    fetchLicenses();
  }, []);

  const fetchLicenses = async () => {
    try {
      const response = await fetch("/api/licenses");
      if (!response.ok) throw new Error("Failed to fetch licenses");
      const data = await response.json();
      setLicenses(data);
    } catch (error) {
      console.error("Error fetching licenses:", error);
    }
  };

  const createLicense = async () => {
    try {
      const response = await fetch("/api/licenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLicense),
      });
      if (!response.ok) throw new Error("Failed to create license");
      const createdLicense = await response.json();
      setLicenses([...licenses, createdLicense]);
      setNewLicense({ apiKeyId: "", productId: "", expiresAt: "" });
    } catch (error) {
      console.error("Error creating license:", error);
    }
  };

  const updateLicense = async (id: string, data: Partial<License>) => {
    try {
      const response = await fetch(`/api/licenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update license");
      const updatedLicense = await response.json();
      setLicenses(
        licenses.map((license) =>
          license.id === id ? updatedLicense : license
        )
      );
    } catch (error) {
      console.error("Error updating license:", error);
    }
  };

  const revokeLicense = async (id: string) => {
    try {
      const response = await fetch(`/api/licenses/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to revoke license");
      setLicenses(licenses.filter((license) => license.id !== id));
    } catch (error) {
      console.error("Error revoking license:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Licenses</CardTitle>
        <CardDescription>Manage your licenses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="API Key ID"
              value={newLicense.apiKeyId}
              onChange={(e) =>
                setNewLicense({ ...newLicense, apiKeyId: e.target.value })
              }
            />
            <Input
              placeholder="Product ID"
              value={newLicense.productId}
              onChange={(e) =>
                setNewLicense({ ...newLicense, productId: e.target.value })
              }
            />
            <Input
              type="date"
              value={newLicense.expiresAt}
              onChange={(e) =>
                setNewLicense({ ...newLicense, expiresAt: e.target.value })
              }
            />
            <Button onClick={createLicense}>Create License</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>API Key ID</TableHead>
                <TableHead>Product ID</TableHead>
                <TableHead>Expires At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {licenses.map((license) => (
                <TableRow key={license.id}>
                  <TableCell>{license.id}</TableCell>
                  <TableCell>{license.apiKeyId}</TableCell>
                  <TableCell>{license.productId}</TableCell>
                  <TableCell>{license.expiresAt}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      onClick={() =>
                        updateLicense(license.id, {
                          expiresAt: new Date(
                            new Date(license.expiresAt).setFullYear(
                              new Date(license.expiresAt).getFullYear() + 1
                            )
                          ).toISOString(),
                        })
                      }
                    >
                      Extend 1 Year
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => revokeLicense(license.id)}
                    >
                      Revoke
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

const ControlPanel: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Control Panel</h1>
      <Tabs defaultValue="apiKeys">
        <TabsList>
          <TabsTrigger value="apiKeys">API Keys</TabsTrigger>
          <TabsTrigger value="licenses">Licenses</TabsTrigger>
        </TabsList>
        <TabsContent value="apiKeys">
          <ApiKeyPanel />
        </TabsContent>
        <TabsContent value="licenses">
          <LicensePanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ControlPanel;
