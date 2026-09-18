// "use client";

// import { useActionState, useState } from "react";
// import {
//     cancelBooking,
//     type CancelBookingState,
// } from "../actions/cancel-booking";

// const initialState: CancelBookingState = {
//     status: "idle",
//     message: "",
// };

// export default function CancelBookingButton({
//     bookingId,
// }: {
//     bookingId: string;
// }) {
//     const [showConfirmation, setShowConfirmation] = useState(false);

//     const [state, formAction, isPending] = useActionState(
//         cancelBooking,
//         initialState
//     );

//     if (state.status === "success") {
//         return (
//             <p role="status" className="mt-4 text-sm text-green-800">
//                 {state.message}
//             </p>
//         );
//     }

//     return (
//         <div className="mt-5 border-t border-gray-200 pt-4">
//             {!showConfirmation ? (
//                 <button
//                     type="button"
//                     onClick={() => setShowConfirmation(true)}
//                     className="rounded-lg border border-red-700 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
//                 >
//                     Cancel booking
//                 </button>
//             ) : (
//                 <form
//                     action={formAction}
//                     className="rounded-lg bg-red-50 p-4"
//                 >
//                     <input
//                         type="hidden"
//                         name="bookingId"
//                         value={bookingId}
//                     />

//                     <p className="font-semibold text-red-900">
//                         Cancel this booking?
//                     </p>

//                     <p className="mt-2 text-sm text-red-900">
//                         This cannot be undone. You would need to submit
//                         a new request to book again.
//                     </p>

//                     <label className="mt-4 flex items-start gap-2 text-sm text-red-900">
//                         <input
//                             type="checkbox"
//                             name="confirmation"
//                             value="on"
//                             required
//                             disabled={isPending}
//                             className="mt-1"
//                         />

//                         <span>
//                             I want to cancel this booking.
//                         </span>
//                     </label>

//                     <div className="mt-4 flex flex-wrap gap-3">
//                         <button
//                             type="submit"
//                             disabled={isPending}
//                             className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
//                         >
//                             {isPending
//                                 ? "Cancelling…"
//                                 : "Yes, cancel booking"}
//                         </button>

//                         <button
//                             type="button"
//                             disabled={isPending}
//                             onClick={() => setShowConfirmation(false)}
//                             className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 disabled:opacity-50"
//                         >
//                             Keep booking
//                         </button>
//                     </div>

//                     {state.status === "error" && (
//                         <p
//                             role="alert"
//                             className="mt-3 text-sm text-red-800"
//                         >
//                             {state.message}
//                         </p>
//                     )}
//                 </form>
//             )}
//         </div>
//     );
// }

"use client";

import { useActionState, useState } from "react";
import {
  cancelBooking,
  type CancelBookingState,
} from "../actions/cancel-booking";

const initialState: CancelBookingState = { status: "idle", message: "" };

export default function CancelBookingButton({
  bookingId,
}: {
  bookingId: string;
}) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [state, formAction, isPending] = useActionState(
    cancelBooking,
    initialState,
  );
  const focusClass =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A8358]";

  if (state.status === "success") {
    return (
      <p
        role="status"
        className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-800"
      >
        {state.message}
      </p>
    );
  }

  return (
    <div className="mt-5 border-t border-[#173F35]/10 pt-5">
      {!showConfirmation ? (
        <button
          type="button"
          onClick={() => setShowConfirmation(true)}
          className={`inline-flex min-h-11 items-center justify-center rounded-md border border-red-700/40 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:border-red-700 hover:bg-red-50 ${focusClass}`}
        >
          Cancel booking
        </button>
      ) : (
        <form
          action={formAction}
          aria-busy={isPending}
          className="rounded-lg border border-red-200 bg-red-50/80 p-4 sm:p-5"
        >
          <input type="hidden" name="bookingId" value={bookingId} />
          <p className="hotel-heading text-2xl text-red-900">
            Cancel this booking?
          </p>
          <p className="mt-3 text-sm leading-6 text-red-900">
            This cannot be undone. You would need to submit a new request to
            book again.
          </p>
          <label className="mt-4 flex min-h-11 items-start gap-3 rounded-md py-2 text-sm leading-6 text-red-900">
            <input
              type="checkbox"
              name="confirmation"
              value="on"
              required
              disabled={isPending}
              className={`mt-1 h-4 w-4 shrink-0 accent-red-700 disabled:cursor-not-allowed ${focusClass}`}
            />
            <span>I want to cancel this booking.</span>
          </label>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="submit"
              disabled={isPending}
              className={`min-h-11 rounded-md bg-red-700 px-4 py-3 text-sm font-medium text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50 ${focusClass}`}
            >
              {isPending ? "Cancelling…" : "Yes, cancel booking"}
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => setShowConfirmation(false)}
              className={`min-h-11 rounded-md border border-[#173F35]/25 bg-[#FFFEFA] px-4 py-3 text-sm font-medium text-[#173F35] hover:bg-[#F0F1E9] disabled:cursor-not-allowed disabled:opacity-50 ${focusClass}`}
            >
              Keep booking
            </button>
          </div>
          {state.status === "error" && (
            <p
              role="alert"
              className="mt-4 wrap-break-word text-sm leading-6 text-red-800"
            >
              {state.message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
