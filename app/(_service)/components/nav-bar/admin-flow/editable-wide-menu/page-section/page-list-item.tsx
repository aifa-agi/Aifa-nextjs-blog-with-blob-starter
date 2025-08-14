// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/page-list-item.tsx

"use client";

import React from "react";
import { Badge } from "@/app/(_service)/components/ui/badge";
import { GripVertical } from "lucide-react";
import { cn } from "@/app/(_service)/lib/utils";
import { PageData } from "@/app/(_service)/types/page-types";
import { humanize } from "@/app/api/menu/persist/humanize";
import { useSortable } from "@dnd-kit/sortable";
import { useRouter } from "next/navigation";

import { MenuCategory } from "@/app/(_service)/types/menu-types";
import { PageActionsDropdown } from "../components/page-actions-dropdown";
import { PublishActionsDropdown } from "../components/publish-actions-dropdown/components/publish-actions-dropdown";
import { VectorStoreActionsDropdown } from "../components/vecror-store-actions-dropdown";
import { ChatSynchroniseActionDropdown } from "../components/chat-synchronise-action-dropdown";
import { LinksActionsDropdown } from "../components/links-action-dropdown";
import { BadgesActionsDropdown } from "../components/badges-actions-dropdown";

const greenDotClass = "bg-emerald-500";

interface PageListItemProps {
  page: PageData;
  categoryTitle: string;
  categories: MenuCategory[];
  setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
}

export function PageListItem({
  page,
  categoryTitle,
  categories,
  setCategories,
}: PageListItemProps) {
  const router = useRouter();
  
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id });

  // Функция для навигации к странице админки
  const handlePageClick = () => {
    if (categoryTitle.toLowerCase() === "admin") {
      router.push(`/admin/${page.linkName}`);
    }
  };

  // Определяем, является ли категория админской
  const isAdminCategory = categoryTitle.toLowerCase() === "admin";

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        transition,
        opacity: isDragging ? 0.6 : 1,
        zIndex: isDragging ? 20 : 1,
      }}
      className="group flex items-center px-2 h-10 relative"
      {...attributes}
      {...listeners}
    >
      <div className="flex-grow flex items-center gap-2 overflow-hidden">
        <span 
          className={cn(
            "overflow-hidden text-ellipsis whitespace-nowrap",
            isAdminCategory && "cursor-pointer hover:text-primary hover:underline"
          )}
          onClick={handlePageClick}
        >
          {humanize(page.linkName)}
        </span>
        {page.hasBadge && page.badgeName && (
          <Badge className="shadow-none rounded-full px-2.5 py-0.5 text-xs font-semibold h-6 flex items-center">
            <div
              className={cn("h-1.5 w-1.5 rounded-full mr-2", greenDotClass)}
            />
            {page.badgeName}
          </Badge>
        )}
      </div>
      
      {/* Показываем действия только если категория не "admin" */}
      {!isAdminCategory && (
        <div className="flex items-center gap-1">
          <BadgesActionsDropdown
            singlePage={page}
            categoryTitle={categoryTitle}
            setCategories={setCategories}
          />
          <PageActionsDropdown
            singlePage={page}
            categoryTitle={categoryTitle}
            categories={categories}
            setCategories={setCategories}
          />
          <PublishActionsDropdown
            singlePage={page}
            categoryTitle={categoryTitle}
            setCategories={setCategories}
          />
          <VectorStoreActionsDropdown
            singlePage={page}
            categoryTitle={categoryTitle}
            setCategories={setCategories}
          />
          <ChatSynchroniseActionDropdown
            singlePage={page}
            categoryTitle={categoryTitle}
            setCategories={setCategories}
          />
          <LinksActionsDropdown
            singlePage={page}
            categoryTitle={categoryTitle}
            setCategories={setCategories}
          />
        </div>
      )}

      <span
        className="flex items-center justify-center w-8 h-8 cursor-grab rounded hover:bg-accent/60 ml-1"
        tabIndex={-1}
      >
        <GripVertical className="w-4 h-4 text-primary/80" />
      </span>
      
      <div className="absolute left-0 bottom-0 w-full h-px bg-border opacity-50 pointer-events-none" />
    </li>
  );
}
