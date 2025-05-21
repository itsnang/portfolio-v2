"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FolderPlus, FolderOpen } from "lucide-react";
import { toast } from "sonner";
import { createFolder, getFolders } from "@/app/dashboard/images/action";

interface FolderSelectorProps {
  onFolderSelect: (folderPath: string) => void;
  selectedFolder?: string;
  className?: string;
}

export const FolderSelector: React.FC<FolderSelectorProps> = ({
  onFolderSelect,
  selectedFolder,
  className,
}) => {
  const [folders, setFolders] = useState<{ name: string; path: string }[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      const folderList = await getFolders();
      setFolders(folderList);
    } catch (error) {
      console.error("Error loading folders:", error);
      toast.error("Failed to load folders");
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error("Please enter a folder name");
      return;
    }

    setIsLoading(true);
    try {
      await createFolder(newFolderName.trim());
      toast.success("Folder created successfully");
      setNewFolderName("");
      setIsCreateDialogOpen(false);
      await loadFolders();
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error("Failed to create folder");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Select
        value={selectedFolder}
        onValueChange={(value: string) => onFolderSelect(value)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select folder" />
        </SelectTrigger>
        <SelectContent>
          {folders.map((folder) => (
            <SelectItem key={folder.path} value={folder.path}>
              <div className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                {folder.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <FolderPlus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="folderName">Folder Name</Label>
              <Input
                id="folderName"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
              />
            </div>
            <Button
              onClick={handleCreateFolder}
              disabled={isLoading || !newFolderName.trim()}
            >
              {isLoading ? "Creating..." : "Create Folder"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
