"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import User from "../database/models/user.model";
import Image from "../database/models/image.model";
import { redirect } from "next/navigation";

const populateUser = (query: any) =>
  query.populate({
    path: "author",
    model: User,
    select: "_id firstName lastName clerkId",
  });

// ADD IMAGE
export async function addImage({ image, userId, path }: AddImageParams) {
  try {
    await connectToDatabase();

    const author = await User.findById(userId);

    if (!author) {
      throw new Error("User not found");
    }

    // Ensure isPublic is explicitly set to true or false
    const isPublic = image.isPublic === true;

    const newImage = await Image.create({
      ...image,
      author: author._id,
      isPublic: isPublic,
      ...(isPublic ? { sharedAt: new Date() } : {}),
    });

    console.log("[addImage] Created image:", {
      _id: newImage._id,
      title: newImage.title,
      isPublic: newImage.isPublic,
      sharedAt: newImage.sharedAt,
    });

    revalidatePath(path);
    revalidatePath("/");
    revalidatePath("/profile");

    return JSON.parse(JSON.stringify(newImage));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE IMAGE
export async function updateImage({ image, userId, path }: UpdateImageParams) {
  try {
    await connectToDatabase();

    const imageToUpdate = await Image.findById(image._id);

    if (!imageToUpdate || imageToUpdate.author.toHexString() !== userId) {
      throw new Error("Unauthorized or image not found");
    }

    const { _id, ...imageData } = image;

    // Ensure isPublic is explicitly set to true or false
    const isPublic = imageData.isPublic === true;

    // Set sharedAt if making public, or clear it if making private
    const updateData = {
      ...imageData,
      isPublic: isPublic,
      sharedAt: isPublic ? imageToUpdate.sharedAt || new Date() : null,
    };

    console.log("[updateImage] Updating with:", {
      isPublic,
      hasSharedAt: !!updateData.sharedAt,
    });

    const updatedImage = await Image.findByIdAndUpdate(
      imageToUpdate._id,
      updateData,
      { new: true }
    );

    console.log("[updateImage] Updated image:", {
      _id: updatedImage?._id,
      title: updatedImage?.title,
      isPublic: updatedImage?.isPublic,
      sharedAt: updatedImage?.sharedAt,
    });

    revalidatePath(path);
    revalidatePath("/");
    revalidatePath("/profile");

    return JSON.parse(JSON.stringify(updatedImage));
  } catch (error) {
    handleError(error);
  }
}

// DELETE IMAGE
export async function deleteImage(imageId: string) {
  try {
    await connectToDatabase();

    await Image.findByIdAndDelete(imageId);
  } catch (error) {
    handleError(error);
  } finally {
    redirect("/");
  }
}

// GET IMAGE
export async function getImageById(imageId: string) {
  try {
    await connectToDatabase();

    const image = await populateUser(Image.findById(imageId));

    if (!image) throw new Error("Image not found");

    return JSON.parse(JSON.stringify(image));
  } catch (error) {
    handleError(error);
  }
}

// GET IMAGES
export async function getAllImages({
  limit = 9,
  page = 1,
  searchQuery = "",
}: {
  limit?: number;
  page: number;
  searchQuery?: string;
}) {
  try {
    await connectToDatabase();

    const filter: any = {
      isPublic: true,
    };

    if (searchQuery) {
      filter.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { prompt: { $regex: searchQuery, $options: "i" } },
        { color: { $regex: searchQuery, $options: "i" } },
        { tags: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const skipAmount = (Number(page) - 1) * limit;

    const images = await populateUser(Image.find(filter))
      .sort({ sharedAt: -1, updatedAt: -1 })
      .skip(skipAmount)
      .limit(limit);

    console.log("[getAllImages] found", images.length, "public images");

    const totalImages = await Image.find(filter).countDocuments();
    const savedImages = await Image.find({ isPublic: true }).countDocuments();

    return {
      data: JSON.parse(JSON.stringify(images)),
      totalPage: Math.ceil(totalImages / limit),
      savedImages,
    };
  } catch (error) {
    handleError(error);
  }
}

// GET IMAGES BY USER
export async function getUserImages({
  limit = 9,
  page = 1,
  userId,
  searchQuery = "",
}: {
  limit?: number;
  page: number;
  userId: string;
  searchQuery?: string;
}) {
  try {
    await connectToDatabase();

    const filter: any = { author: userId };

    if (searchQuery) {
      filter.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { prompt: { $regex: searchQuery, $options: "i" } },
        { color: { $regex: searchQuery, $options: "i" } },
        { tags: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const skipAmount = (Number(page) - 1) * limit;

    const images = await populateUser(Image.find(filter))
      .sort({ updatedAt: -1 })
      .skip(skipAmount)
      .limit(limit);

    const totalImages = await Image.find(filter).countDocuments();

    return {
      data: JSON.parse(JSON.stringify(images)),
      totalPages: Math.ceil(totalImages / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
