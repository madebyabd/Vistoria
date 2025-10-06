"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";

import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { transformationTypes } from "@/constants";
import { IImage } from "@/lib/database/models/image.model";
import { formUrlQuery } from "@/lib/utils";

import { Button } from "../ui/button";

import { Search } from "./Search";

export const Collection = ({
  hasSearch = false,
  images,
  totalPages = 1,
  page,
  hideAuthor = false,
}: {
  images: IImage[];
  totalPages?: number;
  page: number;
  hasSearch?: boolean;
  hideAuthor?: boolean;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // PAGINATION HANDLER
  const onPageChange = (action: string) => {
    const pageValue = action === "next" ? Number(page) + 1 : Number(page) - 1;

    const newUrl = formUrlQuery({
      searchParams: searchParams.toString(),
      key: "page",
      value: pageValue,
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <>
      <div className="collection-heading">
        <h2 className="h2-bold text-foreground">Recent Synths</h2>
        {hasSearch && <Search />}
      </div>

      {images.length > 0 ? (
        <ul className="collection-list">
          {images.map((image) => (
            <Card image={image} key={image._id} hideAuthor={hideAuthor} />
          ))}
        </ul>
      ) : (
        <div className="collection-empty">
          <p className="p-20-semibold">No visions yet. Start crafting.</p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="mt-10">
          <PaginationContent className="flex w-full">
            <Button
              disabled={Number(page) <= 1}
              className="collection-btn"
              onClick={() => onPageChange("prev")}
            >
              <PaginationPrevious className="hover:bg-transparent hover:text-white" />
            </Button>

            <p className="flex-center p-16-medium w-fit flex-1">
              {page} / {totalPages}
            </p>

            <Button
              className="button w-32 bg-purple-gradient bg-cover text-white"
              onClick={() => onPageChange("next")}
              disabled={Number(page) >= totalPages}
            >
              <PaginationNext className="hover:bg-transparent hover:text-white" />
            </Button>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
};

const Card = ({
  image,
  hideAuthor = false,
}: {
  image: IImage;
  hideAuthor?: boolean;
}) => {
  return (
    <li>
      <Link
        href={`/transformations/${image._id}`}
        className="collection-card group"
      >
        <div className="relative overflow-hidden rounded-[18px]">
          <CldImage
            src={image.publicId}
            alt={image.title}
            width={image.width}
            height={image.height}
            {...image.config}
            loading="lazy"
            className="h-52 w-full rounded-[18px] object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
          />
          <div className="pointer-events-none absolute inset-0 rounded-[18px] bg-gradient-to-t from-[#0f172a]/90 via-transparent to-transparent opacity-70" />
          <div className="pointer-events-none absolute inset-0 rounded-[18px] border border-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-60" />
        </div>

        <div className="flex-between">
          <p className="p-20-semibold mr-3 line-clamp-1 text-foreground">
            {image.title}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Image
              src={`/assets/icons/${
                transformationTypes[
                  image.transformationType as TransformationTypeKey
                ].icon
              }`}
              alt={image.title}
              width={24}
              height={24}
              className="drop-shadow-[0_0_12px_rgba(99,102,241,0.65)]"
            />
            {!hideAuthor && image.author?.firstName && (
              <span className="p-16-regular">{image.author.firstName}</span>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
};
