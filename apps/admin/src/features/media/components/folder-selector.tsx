"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@portfolio/ui/button";
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
import { unstable_rethrow } from "next/navigation";
import { createFolder } from "@/features/media/actions/images";
import { useImageFolders, useRefreshImageLibrary } from "@/features/media/hooks/use-images";

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
  const { data: folders = [], isError } = useImageFolders();
  const refreshLibrary = useRefreshImageLibrary();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isError) toast.error("Failed to load folders");
  }, [isError]);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error("Please enter a folder name");
      return;
    }

    setIsLoading(true);
    try {
      const result = await createFolder(newFolderName.trim());
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message);
      setNewFolderName("");
      setIsCreateDialogOpen(false);
      await refreshLibrary();
    } catch (error) {
      unstable_rethrow(error);
      console.error("Failed to create folder:", error);
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
