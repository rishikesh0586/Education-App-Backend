import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import LayoutModel from "../models/layout.model";
import cloudinary from "cloudinary";

// create layout
export const createLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      console.log("Received type:", type);

      const isTypeExist = await LayoutModel.findOne({ type });
      if (isTypeExist) {
        console.log(`${type} already exists`);
        return next(new ErrorHandler(`${type} already exist`, 400));
      }

      if (type === "Banner") {
        const { image, title, subTitle } = req.body;
        console.log("Banner data:", { image, title, subTitle });

        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "layout",
        });
        const banner = {
          type: "Banner",
          banner: {
            image: {
              public_id: myCloud.public_id,
              url: myCloud.secure_url,
            },
            title,
            subTitle,
          },
        };
        await LayoutModel.create(banner);
      }

      if (type === "FAQ") {
        const { faq } = req.body;
        console.log("FAQ data:", faq);

        const faqItems = faq.map((item: any) => ({
          question: item.question,
          answer: item.answer,
        }));
        await LayoutModel.create({ type: "FAQ", faq: faqItems });
      }

      if (type === "Categories") {
        const { categories } = req.body;
        console.log("Categories data:", categories);

        const categoriesItems = categories.map((item: any) => ({
          title: item.title,
        }));
        console.log("Categories items to be saved:", categoriesItems);
        const newCategories = await LayoutModel.create({
          type: "Categories",
          categories: categoriesItems,
        });
        console.log("New categories created:", newCategories);
      }

      res.status(200).json({
        success: true,
        message: "Layout created successfully",
      });
    } catch (error: any) {
      console.error("Error creating layout:", error);
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Edit layout
export const editLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      console.log("Received type for edit:", type);

      if (type === "Banner") {
        const bannerData: any = await LayoutModel.findOne({ type: "Banner" });
        const { image, title, subTitle } = req.body;
        console.log("Banner edit data:", { image, title, subTitle });

        const data = image.startsWith("https")
          ? bannerData
          : await cloudinary.v2.uploader.upload(image, {
              folder: "layout",
            });

        const banner = {
          type: "Banner",
          image: {
            public_id: image.startsWith("https")
              ? bannerData.banner.image.public_id
              : data?.public_id,
            url: image.startsWith("https")
              ? bannerData.banner.image.url
              : data?.secure_url,
          },
          title,
          subTitle,
        };

        await LayoutModel.findByIdAndUpdate(bannerData._id, { banner });
      }

      if (type === "FAQ") {
        const { faq } = req.body;
        console.log("FAQ edit data:", faq);

        const FaqItem = await LayoutModel.findOne({ type: "FAQ" });
        const faqItems = faq.map((item: any) => ({
          question: item.question,
          answer: item.answer,
        }));
        await LayoutModel.findByIdAndUpdate(FaqItem?._id, {
          type: "FAQ",
          faq: faqItems,
        });
      }

      if (type === "Categories") {
        const { categories } = req.body;
        console.log("Categories edit data:", categories);

        const categoriesData = await LayoutModel.findOne({
          type: "Categories",
        });
        const categoriesItems = categories.map((item: any) => ({
          title: item.title,
        }));
        await LayoutModel.findByIdAndUpdate(categoriesData?._id, {
          type: "Categories",
          categories: categoriesItems,
        });
      }

      res.status(200).json({
        success: true,
        message: "Layout updated successfully",
      });
    } catch (error: any) {
      console.error("Error editing layout:", error);
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get layout by type
export const getLayoutByType = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.params;
      console.log("Fetching layout of type:", type);

      const layout = await LayoutModel.findOne({ type });
      console.log("Fetched layout:", layout);
      res.status(201).json({
        success: true,
        layout,
      });
    } catch (error: any) {
      console.error("Error fetching layout:", error);
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
