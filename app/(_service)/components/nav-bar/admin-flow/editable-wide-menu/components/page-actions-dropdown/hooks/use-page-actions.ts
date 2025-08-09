// @/app/(_service)/components/nav-bar/admin-flow/page-actions-dropdown/hooks/use-page-actions.ts

import { useDialogs } from "@/app/(_service)/contexts/dialogs";
import { PageData, PageType } from "@/app/(_service)/types/page-types";
import { MenuCategory } from "@/app/(_service)/types/menu-types";
import { PageActionsHook } from "../types";

interface UsePageActionsProps {
  singlePage: PageData;
  categoryTitle: string;
  categories?: MenuCategory[];
  setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
  getCurrentPageData: () => PageData;
}

export function usePageActions({
  singlePage,
  categoryTitle,
  setCategories,
  getCurrentPageData,
}: UsePageActionsProps): PageActionsHook {
  
  const dialogs = useDialogs();

  // Update page data in categories
  const updatePageInCategories = (
    pageId: string,
    updates: Partial<PageData>
  ) => {
    if (!categoryTitle) return;

    setCategories((prev) => {
      if (!Array.isArray(prev)) return prev;

      return prev.map((cat) =>
        cat.title !== categoryTitle
          ? cat
          : {
              ...cat,
              pages: cat.pages.map((page) =>
                page.id !== pageId
                  ? page
                  : { ...page, ...updates }
              ),
            }
      );
    });
  };

  // Page type handlers
  const handleSetPageType = (type: PageType) => {
    updatePageInCategories(singlePage.id, { type });
  };

  const isPageTypeActive = (type: PageType) => {
    const currentPage = getCurrentPageData();
    return currentPage.type === type;
  };

  // Content handlers
  const handleAddTitle = () => {
    if (!categoryTitle) return;
    
    const currentPage = getCurrentPageData();
    
    dialogs.show({
      type: currentPage.title ? "edit" : "create",
      title: currentPage.title ? "Edit Page Title" : "Add Page Title",
      description: currentPage.title
        ? `Current title: "${currentPage.title}"`
        : "Enter a title for this page",
      value: currentPage.title || "",
      placeholder: "Enter page title...",
      confirmLabel: currentPage.title ? "Update Title" : "Add Title",
      onConfirm: (value) => {
        if (!value?.trim()) return;
        updatePageInCategories(singlePage.id, { title: value.trim() });
      },
    });
  };

  return {
    handleAddTitle,
    handleAddDescription: () => {
      if (!categoryTitle) return;
      
      const currentPage = getCurrentPageData();
      
      dialogs.show({
        type: currentPage.description ? "edit" : "create",
        inputType: "textarea",
        title: currentPage.description ? "Edit Page Description" : "Add Page Description",
        description: currentPage.description
          ? "Update the page description"
          : "Enter a description for this page",
        value: currentPage.description || "",
        placeholder: "Enter page description...",
        confirmLabel: currentPage.description ? "Update Description" : "Add Description",
        onConfirm: (value) => {
          if (!value?.trim()) return;
          updatePageInCategories(singlePage.id, { description: value.trim() });
        },
      });
    },
    handleAddKeywords: () => {
      if (!categoryTitle) return;
      
      const currentPage = getCurrentPageData();
      
      dialogs.show({
        type: currentPage.keyWords?.length ? "edit" : "create",
        inputType: "keywords",
        title: currentPage.keyWords?.length ? "Edit Keywords" : "Add Keywords",
        description: currentPage.keyWords?.length
          ? `Current keywords: ${currentPage.keyWords.length} keyword${currentPage.keyWords.length > 1 ? "s" : ""}`
          : "Enter keywords for this page to improve SEO",
        keywords: currentPage.keyWords?.length ? [...currentPage.keyWords] : [""],
        confirmLabel: currentPage.keyWords?.length ? "Update Keywords" : "Add Keywords",
        onConfirm: (_, keywords) => {
          updatePageInCategories(singlePage.id, {
            keyWords: keywords && keywords.length > 0 ? keywords : [],
          });
        },
      });
    },
    handleAddImages: () => {
      if (!categoryTitle) return;
      
      const currentPage = getCurrentPageData();
      
      dialogs.show({
        type: currentPage.images?.length ? "edit" : "create",
        inputType: "images",
        title: currentPage.images?.length ? "Edit Images" : "Add Images",
        description: currentPage.images?.length
          ? `Current images: ${currentPage.images.length} image${currentPage.images.length > 1 ? "s" : ""}`
          : "Add images with alt descriptions and links for better SEO and user experience",
        images: currentPage.images?.length ? [...currentPage.images] : undefined,
        confirmLabel: currentPage.images?.length ? "Update Images" : "Add Images",
        onConfirm: (_, __, images) => {
          updatePageInCategories(singlePage.id, {
            images: images && images.length > 0 ? images : [],
          });
        },
      });
    },
    handleAddPageCode: () => {
      console.log("Add page code for:", singlePage.id);
    },
    handleSetPageType,
    isPageTypeActive,
  };
}
