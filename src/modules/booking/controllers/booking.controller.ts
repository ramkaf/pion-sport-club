import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../../../../common/utils/ResponseHandler"; // Adjust path as necessary
import BookingService from "../services/booking.service"; // Adjust path as necessary
import { handleAction } from "../../../../common/utils/ResponseHandler";
class BookingController {
  private bookingService: BookingService;

  constructor() {
    this.bookingService = new BookingService();
  }

  create = async (req: Request, res: Response): Promise<void> => {
    const { _id: member } = req.user!;
    const schema = { ...req.body, member }
    handleAction(
      () => this.bookingService.create(schema),
      "Booking created successfully",
      "Error in createBooking controller",
      res
    );
  };


  getAllBookings = async (req: Request, res: Response): Promise<void> => {
    try {
      const bookings = await this.bookingService.getAll();
      return ResponseHandler.success(
        res,
        bookings,
        "Bookings retrieved successfully"
      );
    } catch (error) {
      console.error(error);
      return ResponseHandler.error(res, "Error fetching bookings", error);
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const { id, ...rest } = req.body;
    handleAction(
      () => this.bookingService.update(id, rest),
      "Booking updated successfully",
      "Error in updateBooking controller",
      res
    );
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { _id: member } = req.user!;
    handleAction(
      () => this.bookingService.delete(id, member.toString()),
      "Booking deleted successfully",
      "Error in deleteBooking controller",
      res
    );
  };
}

export default BookingController;
