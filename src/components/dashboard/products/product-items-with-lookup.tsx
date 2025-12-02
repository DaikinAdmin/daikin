"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Loader2 } from "lucide-react";
import { ProductItem } from "@/types/product-items";
import { ProductItemsTab } from "./product-items-tab";

type ProductItemLookup = {
  id: string;
  title: string;
  slug: string;
  img: string | null;
  isActive: boolean;
  lookupItemDetails: {
    locale: string;
    title: string;
    subtitle: string;
    isActive: boolean;
  }[];
};

type ProductItemsWithLookupProps = {
  items: ProductItem[];
  onChange: (items: ProductItem[]) => void;
  t: (key: string) => string;
  disabled?: boolean;
};

export function ProductItemsWithLookup({
  items,
  onChange,
  t,
  disabled = false,
}: ProductItemsWithLookupProps) {
  const [lookupItems, setLookupItems] = useState<ProductItemLookup[]>([]);
  const [loadingLookup, setLoadingLookup] = useState(true);
  const [selectedLookupIds, setSelectedLookupIds] = useState<Set<string>>(new Set());
  const [customItems, setCustomItems] = useState<ProductItem[]>([]);

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    fetchLookupItems();
  }, []);

  useEffect(() => {
    // Only synchronize from parent items on initial load or when explicitly needed
    // Don't run this after internal updates to avoid infinite loops
    if (!isInitialized && items.length > 0) {
      const selected = new Set<string>();
      const custom: ProductItem[] = [];

      items.forEach((item) => {
        if (item.lookupItemId) {
          selected.add(item.lookupItemId);
        } else {
          custom.push(item);
        }
      });

      setSelectedLookupIds(selected);
      setCustomItems(custom);
      setIsInitialized(true);
    }
  }, [items, isInitialized]);

  const fetchLookupItems = async () => {
    try {
      setLoadingLookup(true);
      const response = await fetch("/api/product-items-lookup");
      if (!response.ok) throw new Error("Failed to fetch lookup items");
      const data = await response.json();
      setLookupItems(data);
    } catch (error) {
      console.error("Error fetching lookup items:", error);
    } finally {
      setLoadingLookup(false);
    }
  };

  const handleLookupToggle = (lookupItem: ProductItemLookup, checked: boolean) => {
    const newSelected = new Set(selectedLookupIds);
    
    if (checked) {
      newSelected.add(lookupItem.id);
    } else {
      newSelected.delete(lookupItem.id);
    }
    
    setSelectedLookupIds(newSelected);
    updateItems(newSelected, customItems);
  };

  const handleCustomItemsChange = (newCustomItems: ProductItem[]) => {
    setCustomItems(newCustomItems);
    updateItems(selectedLookupIds, newCustomItems);
  };

  const updateItems = (selected: Set<string>, custom: ProductItem[]) => {
    // Create items array from selected lookup items
    const lookupBasedItems: ProductItem[] = Array.from(selected).map((lookupId) => {
      const lookupItem = lookupItems.find((item) => item.id === lookupId);
      if (!lookupItem) return null;

      // Check if this item already exists in the current items (to preserve any edits)
      const existingItem = items.find((item) => item.lookupItemId === lookupId);
      
      return existingItem || {
        title: lookupItem.title,
        slug: lookupItem.slug,
        img: lookupItem.img || "",
        isActive: lookupItem.isActive,
        lookupItemId: lookupItem.id,
        translations: lookupItem.lookupItemDetails.map((detail) => ({
          locale: detail.locale,
          title: detail.title,
          subtitle: detail.subtitle,
          isActive: detail.isActive,
        })),
      };
    }).filter((item): item is ProductItem => item !== null);

    // Combine lookup-based items and custom items
    onChange([...lookupBasedItems, ...custom]);
  };

  return (
    <div className="space-y-6">
      {/* Shared Items Section */}
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{t("sharedItems")}</h3>
          <p className="text-sm text-muted-foreground">{t("sharedItemsDescription")}</p>
        </div>

        {loadingLookup ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : lookupItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <p>{t("noLookupItems")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lookupItems.map((lookupItem) => (
              <div
                key={lookupItem.id}
                className={`border rounded-lg p-4 flex items-start gap-3 transition-colors ${
                  selectedLookupIds.has(lookupItem.id)
                    ? "border-primary bg-primary/5"
                    : "hover:bg-accent"
                }`}
              >
                <Checkbox
                  checked={selectedLookupIds.has(lookupItem.id)}
                  onCheckedChange={(checked) =>
                    handleLookupToggle(lookupItem, checked === true)
                  }
                  disabled={disabled}
                  className="mt-1"
                />
                <div 
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() =>
                    handleLookupToggle(lookupItem, !selectedLookupIds.has(lookupItem.id))
                  }
                >
                  {lookupItem.img && (
                    <img
                      src={lookupItem.img}
                      alt={lookupItem.title}
                      className="w-16 h-16 object-cover rounded mb-2"
                    />
                  )}
                  <h4 className="font-medium">{lookupItem.title}</h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {lookupItem.slug}
                  </p>
                  {!lookupItem.isActive && (
                    <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded">
                      {t("inactive")}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Items Section */}
      <div className="border-t pt-6">
        <ProductItemsTab
          items={customItems}
          onChange={handleCustomItemsChange}
          t={t}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
