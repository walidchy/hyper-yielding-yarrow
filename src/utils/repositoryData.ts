
import { RepositoryItemType } from "../components/RepositoryItem";

// Sample repository data
export const generateSampleRepositoryData = (): RepositoryItemType[] => {
  return [
    {
      id: "1",
      name: "Documents",
      type: "folder",
      starred: true,
      updatedAt: "2025-05-01T10:30:00Z",
    },
    {
      id: "2",
      name: "Images",
      type: "folder",
      starred: false,
      updatedAt: "2025-05-02T14:20:00Z",
    },
    {
      id: "3",
      name: "Project Plan.pdf",
      type: "file",
      starred: true,
      updatedAt: "2025-05-03T09:15:00Z",
    },
    {
      id: "4",
      name: "Budget.xlsx",
      type: "file",
      starred: false,
      updatedAt: "2025-05-04T16:45:00Z",
    },
    {
      id: "5",
      name: "Presentation.pptx",
      type: "file",
      starred: false,
      updatedAt: "2025-05-05T11:10:00Z",
    },
    {
      id: "6",
      name: "Archive",
      type: "folder",
      starred: false,
      updatedAt: "2025-04-28T08:30:00Z",
    },
  ];
};
