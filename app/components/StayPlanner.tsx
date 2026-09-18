// "use client";

// import { useEffect, useRef, useState } from "react";
// import Navbar from "./Navbar";
// import Footer from "./Footer";
// import {
//     submitBooking,
//     type BookingResult,
// } from "../actions/bookings";

// type PlannerRoom = {
//     name: string;
//     slug: string;
//     price: number;
//     capacity: number;
//     breakfastIncluded: boolean;
// };

// type StayPlannerProps = {
//     rooms: PlannerRoom[];
//     dinner: {
//         name: string;
//         pricePerGuestPerNight: number;
//     } | null;
//     natureWalk: {
//         name: string;
//         pricePerGuestPerSession: number;
//     } | null;
// };

// const MAX_INT = 2147483647;

// function formatMoney(value: number) {
//     return value.toLocaleString("en-US");
// }

// export default function StayPlanner({
//     rooms,
//     dinner,
//     natureWalk,
// }: StayPlannerProps) {
//     // Customer selections.
//     const [budget, setBudget] = useState("");
//     const [checkIn, setCheckIn] = useState("");
//     const [checkOut, setCheckOut] = useState("");
//     const [guests, setGuests] = useState("2");
//     const [selectedRoomSlug, setSelectedRoomSlug] = useState("");
//     const [includeDinner, setIncludeDinner] = useState(false);
//     const [includeNatureWalk, setIncludeNatureWalk] = useState(false);

//     // Review and contact details.
//     const [showReview, setShowReview] = useState(false);
//     const [fullName, setFullName] = useState("");
//     const [phone, setPhone] = useState("");
//     const [nameTouched, setNameTouched] = useState(false);
//     const [phoneTouched, setPhoneTouched] = useState(false);

//     // Booking submission.
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [bookingResult, setBookingResult] =
//         useState<BookingResult | null>(null);

//     const reviewRef = useRef<HTMLElement | null>(null);
//     const resultRef = useRef<HTMLDivElement | null>(null);
//     const submitLock = useRef(false);

//     const requestRef = useRef<{
//         payload: string;
//         id: string;
//     } | null>(null);

//     const inputClassName =
//         "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#173F35] disabled:opacity-70";

//     const buttonClassName =
//         "mt-6 w-full rounded-lg bg-[#173F35] px-5 py-3 font-medium text-white hover:bg-[#245548] disabled:cursor-not-allowed disabled:opacity-50";

//     // Number of nights.
//     let nights = 0;

//     if (checkIn && checkOut) {
//         const start = new Date(`${checkIn}T00:00:00.000Z`).getTime();
//         const end = new Date(`${checkOut}T00:00:00.000Z`).getTime();

//         nights = (end - start) / 86400000;
//     }

//     const areDatesValid = Number.isInteger(nights) && nights > 0;

//     const selectedRoom = rooms.find(
//         (room) => room.slug === selectedRoomSlug
//     );

//     const guestCount = Number(guests);

//     const isGuestCountValid =
//         Number.isSafeInteger(guestCount) &&
//         guestCount >= 1 &&
//         guestCount <= MAX_INT;

//     const isCapacityValid =
//         selectedRoom !== undefined &&
//         isGuestCountValid &&
//         guestCount <= selectedRoom.capacity;

//     const canCalculate = areDatesValid && isCapacityValid;

//     // Only available extras can be selected.
//     const isDinnerSelected = dinner !== null && includeDinner;
//     const isNatureWalkSelected =
//         natureWalk !== null && includeNatureWalk;

//     const dinnerPrice = dinner?.pricePerGuestPerNight ?? 0;
//     const natureWalkPrice = natureWalk?.pricePerGuestPerSession ?? 0;

//     let roomCost = 0;
//     let dinnerCost = 0;
//     let activityCost = 0;

//     if (selectedRoom && canCalculate) {
//         roomCost = selectedRoom.price * nights;

//         if (isDinnerSelected) {
//             dinnerCost = dinnerPrice * guestCount * nights;
//         }

//         if (isNatureWalkSelected) {
//             activityCost = natureWalkPrice * guestCount;
//         }
//     }

//     const totalCost = roomCost + dinnerCost + activityCost;

//     const isTotalValid =
//         Number.isSafeInteger(totalCost) &&
//         totalCost >= 0 &&
//         totalCost <= MAX_INT;

//     // Budget validation.
//     const budgetAmount = Number(budget);

//     const isBudgetValid =
//         Number.isSafeInteger(budgetAmount) &&
//         budgetAmount > 0 &&
//         budgetAmount <= MAX_INT;

//     const remainingBudget = budgetAmount - totalCost;

//     // Contact validation.
//     const trimmedName = fullName.trim();
//     const isNameValid =
//         trimmedName.length > 0 && trimmedName.length <= 100;

//     const cleanedPhone = phone.replace(/[\s()-]/g, "");
//     const isPhoneValid =
//         phone.length <= 40 &&
//         /^\+?[0-9]{7,15}$/.test(cleanedPhone);

//     const showNameError = nameTouched && !isNameValid;
//     const showPhoneError = phoneTouched && !isPhoneValid;

//     const canReview =
//         canCalculate && isBudgetValid && isTotalValid;

//     const isReviewVisible = showReview && canReview;
//     const isSubmitted = bookingResult?.status === "success";
//     const isFormLocked = isSubmitting || isSubmitted;

//     // Scroll to the review when opened.
//     useEffect(() => {
//         if (isReviewVisible) {
//             reviewRef.current?.scrollIntoView({
//                 behavior: "smooth",
//                 block: "start",
//             });
//         }
//     }, [isReviewVisible]);

//     // Scroll to the submission result.
//     useEffect(() => {
//         if (bookingResult) {
//             resultRef.current?.scrollIntoView({
//                 behavior: "smooth",
//                 block: "center",
//             });
//         }
//     }, [bookingResult]);

//     function handleReview() {
//         if (!canReview || isFormLocked) {
//             return;
//         }

//         if (showReview) {
//             reviewRef.current?.scrollIntoView({
//                 behavior: "smooth",
//                 block: "start",
//             });
//         } else {
//             setShowReview(true);
//         }
//     }

//     async function handleSubmitBooking() {
//         if (submitLock.current || isSubmitted) {
//             return;
//         }

//         setNameTouched(true);
//         setPhoneTouched(true);
//         setBookingResult(null);

//         if (!canReview || !isNameValid || !isPhoneValid) {
//             setBookingResult({
//                 status: "error",
//                 message:
//                     "Please check your selections and contact details.",
//             });
//             return;
//         }

//         submitLock.current = true;
//         setIsSubmitting(true);

//         try {
//             const values = {
//                 roomSlug: selectedRoomSlug,
//                 checkIn,
//                 checkOut,
//                 guests: guestCount,
//                 budget: budgetAmount,
//                 fullName: trimmedName,
//                 phone: cleanedPhone,
//                 includeDinner: isDinnerSelected,
//                 includeNatureWalk: isNatureWalkSelected,
//                 expectedTotal: totalCost,
//             };

//             const payload = JSON.stringify(values);

//             // Keep the same ID when retrying unchanged selections.
//             let request = requestRef.current;

//             if (!request || request.payload !== payload) {
//                 request = {
//                     payload,
//                     id: crypto.randomUUID(),
//                 };

//                 requestRef.current = request;
//             }

//             const result = await submitBooking({
//                 ...values,
//                 requestId: request.id,
//             });

//             setBookingResult(result);
//         } catch {
//             setBookingResult({
//                 status: "error",
//                 message:
//                     "Connection failed. Please retry without changing your selections.",
//             });
//         } finally {
//             submitLock.current = false;
//             setIsSubmitting(false);
//         }
//     }

//     return (
//         <div className="flex min-h-screen flex-col bg-[#F8F6EF] text-[#173F35]">
//             <Navbar />

//             <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
//                 <h1 className="text-4xl font-bold">
//                     Plan My Stay
//                 </h1>

//                 <p className="mt-4 text-lg">
//                     Choose your dates, guests and budget to start
//                     planning your stay.
//                 </p>

//                 <fieldset
//                     disabled={isFormLocked}
//                     aria-busy={isSubmitting}
//                     className="min-w-0"
//                 >
//                     <legend className="sr-only">
//                         Your stay selections and contact details
//                     </legend>

//                     {/* Check-in */}
//                     <div className="mt-8 max-w-sm">
//                         <label
//                             htmlFor="checkIn"
//                             className="mb-2 block font-medium"
//                         >
//                             Check-in date
//                         </label>

//                         <input
//                             id="checkIn"
//                             name="checkIn"
//                             type="date"
//                             value={checkIn}
//                             onChange={(event) =>
//                                 setCheckIn(event.target.value)
//                             }
//                             className={inputClassName}
//                         />
//                     </div>

//                     {/* Check-out */}
//                     <div className="mt-6 max-w-sm">
//                         <label
//                             htmlFor="checkOut"
//                             className="mb-2 block font-medium"
//                         >
//                             Check-out date
//                         </label>

//                         <input
//                             id="checkOut"
//                             name="checkOut"
//                             type="date"
//                             value={checkOut}
//                             onChange={(event) =>
//                                 setCheckOut(event.target.value)
//                             }
//                             aria-invalid={
//                                 Boolean(checkIn && checkOut) &&
//                                 !areDatesValid
//                             }
//                             aria-describedby={
//                                 checkIn && checkOut
//                                     ? "dates-message"
//                                     : undefined
//                             }
//                             className={inputClassName}
//                         />

//                         {checkIn && checkOut && (
//                             <p
//                                 id="dates-message"
//                                 className={`mt-4 font-medium ${
//                                     areDatesValid
//                                         ? "text-[#173F35]"
//                                         : "text-red-700"
//                                 }`}
//                             >
//                                 {areDatesValid
//                                     ? `Number of nights: ${nights}`
//                                     : "Check-out must be after check-in."}
//                             </p>
//                         )}
//                     </div>

//                     {/* Guests */}
//                     <div className="mt-6 max-w-sm">
//                         <label
//                             htmlFor="guests"
//                             className="mb-2 block font-medium"
//                         >
//                             Number of guests
//                         </label>

//                         <input
//                             id="guests"
//                             name="guests"
//                             type="number"
//                             min={1}
//                             max={MAX_INT}
//                             step={1}
//                             value={guests}
//                             onChange={(event) =>
//                                 setGuests(event.target.value)
//                             }
//                             aria-invalid={!isGuestCountValid}
//                             aria-describedby={
//                                 !isGuestCountValid
//                                     ? "guests-error"
//                                     : undefined
//                             }
//                             className={inputClassName}
//                         />

//                         {!isGuestCountValid && (
//                             <p
//                                 id="guests-error"
//                                 className="mt-2 text-sm text-red-700"
//                             >
//                                 Enter a valid whole number of guests,
//                                 at least 1.
//                             </p>
//                         )}
//                     </div>

//                     {/* Budget */}
//                     <div className="mt-6 max-w-sm">
//                         <label
//                             htmlFor="budget"
//                             className="mb-2 block font-medium"
//                         >
//                             Total budget (LKR)
//                         </label>

//                         <input
//                             id="budget"
//                             name="budget"
//                             type="number"
//                             min={1}
//                             max={MAX_INT}
//                             step={1}
//                             placeholder="Example: 65000"
//                             value={budget}
//                             onChange={(event) =>
//                                 setBudget(event.target.value)
//                             }
//                             aria-invalid={
//                                 budget !== "" && !isBudgetValid
//                             }
//                             aria-describedby={
//                                 budget !== "" && !isBudgetValid
//                                     ? "budget-help budget-error"
//                                     : "budget-help"
//                             }
//                             className={inputClassName}
//                         />

//                         {budget !== "" && !isBudgetValid && (
//                             <p
//                                 id="budget-error"
//                                 className="mt-2 text-sm text-red-700"
//                             >
//                                 Enter a whole-rupee budget between 1
//                                 and {formatMoney(MAX_INT)}.
//                             </p>
//                         )}

//                         <p
//                             id="budget-help"
//                             className="mt-2 text-sm text-gray-600"
//                         >
//                             Your budget for the entire stay,
//                             including room, meals and activities.
//                         </p>
//                     </div>

//                     {/* Room selection */}
//                     <div className="mt-6 max-w-sm">
//                         <label
//                             htmlFor="room"
//                             className="mb-2 block font-medium"
//                         >
//                             Choose your room
//                         </label>

//                         <select
//                             id="room"
//                             name="room"
//                             value={selectedRoomSlug}
//                             disabled={rooms.length === 0}
//                             onChange={(event) =>
//                                 setSelectedRoomSlug(event.target.value)
//                             }
//                             className={inputClassName}
//                         >
//                             <option value="">Select a room</option>

//                             {rooms.map((room) => (
//                                 <option
//                                     key={room.slug}
//                                     value={room.slug}
//                                 >
//                                     {room.name}
//                                 </option>
//                             ))}
//                         </select>

//                         {rooms.length === 0 && (
//                             <p className="mt-2 text-sm text-gray-600">
//                                 No room types are currently offered.
//                                 Please contact the hotel.
//                             </p>
//                         )}

//                         {selectedRoom && (
//                             <p className="mt-2 text-sm text-gray-600">
//                                 LKR {formatMoney(selectedRoom.price)}{" "}
//                                 per room per night. Up to{" "}
//                                 {selectedRoom.capacity} guests.
//                             </p>
//                         )}

//                         {selectedRoom &&
//                             isGuestCountValid &&
//                             guestCount > selectedRoom.capacity && (
//                                 <p className="mt-2 text-sm text-red-700">
//                                     This room allows up to{" "}
//                                     {selectedRoom.capacity} guests.
//                                     Please choose another room or
//                                     reduce the guest count.
//                                 </p>
//                             )}
//                     </div>

//                     {/* Meals */}
//                     <div className="mt-8 max-w-sm">
//                         <h2 className="text-2xl font-semibold">
//                             Add meals
//                         </h2>

//                         {selectedRoom && (
//                             <p className="mt-3 text-sm text-gray-600">
//                                 {selectedRoom.breakfastIncluded
//                                     ? "Breakfast is included in your room price."
//                                     : "Breakfast is not included in your room price."}
//                             </p>
//                         )}

//                         <label
//                             htmlFor="includeDinner"
//                             className="mt-4 flex items-start gap-3"
//                         >
//                             <input
//                                 id="includeDinner"
//                                 name="includeDinner"
//                                 type="checkbox"
//                                 checked={isDinnerSelected}
//                                 disabled={!dinner}
//                                 onChange={(event) =>
//                                     setIncludeDinner(event.target.checked)
//                                 }
//                                 className="mt-1 h-5 w-5 accent-[#173F35] disabled:cursor-not-allowed"
//                             />

//                             <span>
//                                 <span className="block font-medium">
//                                     Add {dinner?.name ?? "dinner"}
//                                 </span>

//                                 <span className="block text-sm text-gray-600">
//                                     {dinner
//                                         ? `LKR ${formatMoney(dinnerPrice)} per guest per night. Applies to all guests on every night.`
//                                         : "Dinner is currently unavailable."}
//                                 </span>
//                             </span>
//                         </label>

//                         <p className="mt-4 text-sm">
//                             {isDinnerSelected
//                                 ? "Dinner selected."
//                                 : "Dinner not selected."}
//                         </p>
//                     </div>

//                     {/* Activities */}
//                     <div className="mt-8 max-w-sm">
//                         <h2 className="text-2xl font-semibold">
//                             Add activities
//                         </h2>

//                         <label
//                             htmlFor="includeNatureWalk"
//                             className="mt-4 flex items-start gap-3"
//                         >
//                             <input
//                                 id="includeNatureWalk"
//                                 name="includeNatureWalk"
//                                 type="checkbox"
//                                 checked={isNatureWalkSelected}
//                                 disabled={!natureWalk}
//                                 onChange={(event) =>
//                                     setIncludeNatureWalk(
//                                         event.target.checked
//                                     )
//                                 }
//                                 className="mt-1 h-5 w-5 accent-[#173F35] disabled:cursor-not-allowed"
//                             />

//                             <span>
//                                 <span className="block font-medium">
//                                     {natureWalk?.name ??
//                                         "Guided nature walk"}
//                                 </span>

//                                 <span className="block text-sm text-gray-600">
//                                     {natureWalk
//                                         ? `LKR ${formatMoney(natureWalkPrice)} per guest. One session for all guests during your stay.`
//                                         : "Nature walk is currently unavailable."}
//                                 </span>
//                             </span>
//                         </label>
//                     </div>

//                     {/* Cost summary */}
//                     {selectedRoom && canCalculate && (
//                         <section className="mt-8 max-w-sm rounded-2xl border border-gray-200 bg-white p-6">
//                             <h2 className="text-2xl font-semibold">
//                                 Cost summary
//                             </h2>

//                             <p className="mt-4 font-medium">
//                                 {selectedRoom.name}
//                             </p>

//                             <p className="mt-2 text-sm text-gray-600">
//                                 {nights}{" "}
//                                 {nights === 1 ? "night" : "nights"} ·{" "}
//                                 {guestCount}{" "}
//                                 {guestCount === 1 ? "guest" : "guests"}{" "}
//                                 · 1 room
//                             </p>

//                             <div className="mt-6 space-y-3">
//                                 <p>
//                                     Room cost: LKR {formatMoney(roomCost)}
//                                 </p>

//                                 <p>
//                                     Dinner cost: LKR{" "}
//                                     {formatMoney(dinnerCost)}
//                                 </p>

//                                 <p>
//                                     Nature walk: LKR{" "}
//                                     {formatMoney(activityCost)}
//                                 </p>

//                                 <p className="border-t border-gray-200 pt-3 text-xl font-bold">
//                                     Total cost: LKR{" "}
//                                     {formatMoney(totalCost)}
//                                 </p>
//                             </div>

//                             {!isTotalValid && (
//                                 <p className="mt-4 text-sm text-red-700">
//                                     We cannot calculate a valid total
//                                     for this selection. Please contact
//                                     the hotel.
//                                 </p>
//                             )}

//                             {isBudgetValid ? (
//                                 <div className="mt-6">
//                                     <p>
//                                         Your budget: LKR{" "}
//                                         {formatMoney(budgetAmount)}
//                                     </p>

//                                     {remainingBudget >= 0 ? (
//                                         <p className="mt-2 font-medium text-green-800">
//                                             Budget remaining: LKR{" "}
//                                             {formatMoney(remainingBudget)}
//                                         </p>
//                                     ) : (
//                                         <p className="mt-2 font-medium text-red-700">
//                                             Total cost exceeds your
//                                             budget by LKR{" "}
//                                             {formatMoney(
//                                                 Math.abs(remainingBudget)
//                                             )}
//                                         </p>
//                                     )}
//                                 </div>
//                             ) : (
//                                 <p className="mt-6 text-sm text-gray-600">
//                                     Enter a valid budget to compare it
//                                     with your total cost.
//                                 </p>
//                             )}

//                             <p className="mt-4 text-sm text-gray-600">
//                                 This estimate includes the room and
//                                 selected extras. Room and activity
//                                 availability for your dates will be
//                                 checked by hotel staff.
//                             </p>

//                             <button
//                                 type="button"
//                                 disabled={!canReview || isFormLocked}
//                                 onClick={handleReview}
//                                 className={buttonClassName}
//                             >
//                                 Review My Stay
//                             </button>
//                         </section>
//                     )}

//                     {/* Review and contact details */}
//                     {isReviewVisible && selectedRoom && (
//                         <section
//                             ref={reviewRef}
//                             className="mt-8 max-w-sm scroll-mt-6 rounded-2xl border border-gray-200 bg-white p-6"
//                         >
//                             <h2 className="text-2xl font-semibold">
//                                 Review your stay
//                             </h2>

//                             <div className="mt-4 space-y-3">
//                                 <p>Room: {selectedRoom.name}</p>
//                                 <p>Check-in: {checkIn}</p>
//                                 <p>Check-out: {checkOut}</p>
//                                 <p>Nights: {nights}</p>
//                                 <p>Guests: {guestCount}</p>

//                                 <p>
//                                     Dinner:{" "}
//                                     {isDinnerSelected
//                                         ? "Included in your selection"
//                                         : "Not selected"}
//                                 </p>

//                                 <p>
//                                     Nature walk:{" "}
//                                     {isNatureWalkSelected
//                                         ? "One session selected"
//                                         : "Not selected"}
//                                 </p>

//                                 <p className="text-xl font-bold">
//                                     Total: LKR {formatMoney(totalCost)}
//                                 </p>

//                                 {remainingBudget < 0 && (
//                                     <p className="text-sm text-red-700">
//                                         This stay exceeds your budget
//                                         by LKR{" "}
//                                         {formatMoney(
//                                             Math.abs(remainingBudget)
//                                         )}
//                                         .
//                                     </p>
//                                 )}
//                             </div>

//                             <p className="mt-4 text-sm text-gray-600">
//                                 {isSubmitted
//                                     ? "Your request has been saved. Hotel staff confirmation is still required."
//                                     : "Submit these selections as a booking request. Your booking is confirmed only after hotel staff approve it."}
//                             </p>

//                             <div className="mt-6">
//                                 <h3 className="text-xl font-semibold">
//                                     Your contact details
//                                 </h3>

//                                 <label
//                                     htmlFor="fullName"
//                                     className="mb-2 mt-4 block font-medium"
//                                 >
//                                     Full name
//                                 </label>

//                                 <input
//                                     id="fullName"
//                                     name="fullName"
//                                     type="text"
//                                     autoComplete="name"
//                                     maxLength={100}
//                                     value={fullName}
//                                     onChange={(event) =>
//                                         setFullName(event.target.value)
//                                     }
//                                     onBlur={() => setNameTouched(true)}
//                                     aria-invalid={showNameError}
//                                     aria-describedby={
//                                         showNameError
//                                             ? "name-error"
//                                             : undefined
//                                     }
//                                     className={inputClassName}
//                                 />

//                                 {showNameError && (
//                                     <p
//                                         id="name-error"
//                                         className="mt-2 text-sm text-red-700"
//                                     >
//                                         Enter your full name using
//                                         1–100 characters.
//                                     </p>
//                                 )}

//                                 <label
//                                     htmlFor="phone"
//                                     className="mb-2 mt-4 block font-medium"
//                                 >
//                                     Phone number
//                                 </label>

//                                 <input
//                                     id="phone"
//                                     name="phone"
//                                     type="tel"
//                                     autoComplete="tel"
//                                     maxLength={40}
//                                     placeholder="Example: +94771234567"
//                                     value={phone}
//                                     onChange={(event) =>
//                                         setPhone(event.target.value)
//                                     }
//                                     onBlur={() => setPhoneTouched(true)}
//                                     aria-invalid={showPhoneError}
//                                     aria-describedby={
//                                         showPhoneError
//                                             ? "phone-error"
//                                             : undefined
//                                     }
//                                     className={inputClassName}
//                                 />

//                                 {showPhoneError && (
//                                     <p
//                                         id="phone-error"
//                                         className="mt-2 text-sm text-red-700"
//                                     >
//                                         Enter 7–15 digits, optionally
//                                         starting with +. Spaces,
//                                         hyphens and parentheses are
//                                         allowed.
//                                     </p>
//                                 )}
//                             </div>

//                             <button
//                                 type="button"
//                                 onClick={handleSubmitBooking}
//                                 disabled={!canReview || isFormLocked}
//                                 className={buttonClassName}
//                             >
//                                 {isSubmitting
//                                     ? "Submitting…"
//                                     : isSubmitted
//                                       ? "Request submitted"
//                                       : "Submit booking request"}
//                             </button>

//                             <button
//                                 type="button"
//                                 onClick={() => setShowReview(false)}
//                                 disabled={isFormLocked}
//                                 className="mt-4 font-medium underline disabled:cursor-not-allowed disabled:opacity-50"
//                             >
//                                 Close review
//                             </button>
//                         </section>
//                     )}
//                 </fieldset>

//                 {/* Result stays outside the disabled fieldset. */}
//                 <div ref={resultRef} className="scroll-mt-6">
//                     {bookingResult?.status === "error" && (
//                         <div
//                             role="alert"
//                             className="mt-6 max-w-sm rounded-lg bg-red-50 p-4 text-red-700"
//                         >
//                             <p>{bookingResult.message}</p>
//                         </div>
//                     )}

//                     {bookingResult?.status === "success" && (
//                         <section
//                             role="status"
//                             className="mt-6 max-w-sm rounded-2xl border border-green-200 bg-green-50 p-6"
//                         >
//                             <h2 className="text-xl font-semibold">
//                                 Booking request received
//                             </h2>

//                             <p className="mt-3">
//                                 Request saved for hotel review.
//                             </p>

//                             <p className="mt-2 break-all text-sm">
//                                 Reference: {bookingResult.bookingId}
//                             </p>

//                             <p className="mt-2 font-semibold">
//                                 Total: LKR{" "}
//                                 {formatMoney(bookingResult.totalCost)}
//                             </p>

//                             <p className="mt-3 text-sm">
//                                 Hotel staff will check availability
//                                 before confirming your booking.
//                             </p>
//                         </section>
//                     )}
//                 </div>
//             </main>

//             <Footer />
//         </div>
//     );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { submitBooking, type BookingResult } from "../actions/bookings";

type PlannerRoom = {
  name: string;
  slug: string;
  price: number;
  capacity: number;
  breakfastIncluded: boolean;
};

type StayPlannerProps = {
  rooms: PlannerRoom[];
  dinner: {
    name: string;
    pricePerGuestPerNight: number;
  } | null;
  natureWalk: {
    name: string;
    pricePerGuestPerSession: number;
  } | null;
};

const MAX_INT = 2147483647;

function formatMoney(value: number) {
  return value.toLocaleString("en-US");
}

export default function StayPlanner({
  rooms,
  dinner,
  natureWalk,
}: StayPlannerProps) {
  // Customer selections.
  const [budget, setBudget] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [selectedRoomSlug, setSelectedRoomSlug] = useState("");
  const [includeDinner, setIncludeDinner] = useState(false);
  const [includeNatureWalk, setIncludeNatureWalk] = useState(false);

  // Review and contact details.
  const [showReview, setShowReview] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);

  // Booking submission.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(
    null,
  );

  const reviewRef = useRef<HTMLElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const submitLock = useRef(false);

  const requestRef = useRef<{
    payload: string;
    id: string;
  } | null>(null);

  const inputClassName =
    "min-h-12 w-full min-w-0 rounded-md border border-[#173F35]/20 bg-white px-4 py-3 text-base text-[#173F35] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A8358] disabled:cursor-not-allowed disabled:opacity-60";

  const buttonClassName =
    "mt-6 flex min-h-12 w-full items-center justify-center rounded-md bg-[#173F35] px-5 py-3 text-sm font-medium text-white hover:bg-[#245548] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A8358] disabled:cursor-not-allowed disabled:opacity-50";

  // Number of nights.
  let nights = 0;

  if (checkIn && checkOut) {
    const start = new Date(`${checkIn}T00:00:00.000Z`).getTime();
    const end = new Date(`${checkOut}T00:00:00.000Z`).getTime();

    nights = (end - start) / 86400000;
  }

  const areDatesValid = Number.isInteger(nights) && nights > 0;

  const selectedRoom = rooms.find((room) => room.slug === selectedRoomSlug);

  const guestCount = Number(guests);

  const isGuestCountValid =
    Number.isSafeInteger(guestCount) &&
    guestCount >= 1 &&
    guestCount <= MAX_INT;

  const isCapacityValid =
    selectedRoom !== undefined &&
    isGuestCountValid &&
    guestCount <= selectedRoom.capacity;

  const canCalculate = areDatesValid && isCapacityValid;

  // Only available extras can be selected.
  const isDinnerSelected = dinner !== null && includeDinner;
  const isNatureWalkSelected = natureWalk !== null && includeNatureWalk;

  const dinnerPrice = dinner?.pricePerGuestPerNight ?? 0;
  const natureWalkPrice = natureWalk?.pricePerGuestPerSession ?? 0;

  let roomCost = 0;
  let dinnerCost = 0;
  let activityCost = 0;

  if (selectedRoom && canCalculate) {
    roomCost = selectedRoom.price * nights;

    if (isDinnerSelected) {
      dinnerCost = dinnerPrice * guestCount * nights;
    }

    if (isNatureWalkSelected) {
      activityCost = natureWalkPrice * guestCount;
    }
  }

  const totalCost = roomCost + dinnerCost + activityCost;

  const isTotalValid =
    Number.isSafeInteger(totalCost) && totalCost >= 0 && totalCost <= MAX_INT;

  // Budget validation.
  const budgetAmount = Number(budget);

  const isBudgetValid =
    Number.isSafeInteger(budgetAmount) &&
    budgetAmount > 0 &&
    budgetAmount <= MAX_INT;

  const remainingBudget = budgetAmount - totalCost;

  // Contact validation.
  const trimmedName = fullName.trim();
  const isNameValid = trimmedName.length > 0 && trimmedName.length <= 100;

  const cleanedPhone = phone.replace(/[\s()-]/g, "");
  const isPhoneValid =
    phone.length <= 40 && /^\+?[0-9]{7,15}$/.test(cleanedPhone);

  const showNameError = nameTouched && !isNameValid;
  const showPhoneError = phoneTouched && !isPhoneValid;

  const canReview = canCalculate && isBudgetValid && isTotalValid;

  const isReviewVisible = showReview && canReview;
  const isSubmitted = bookingResult?.status === "success";
  const isFormLocked = isSubmitting || isSubmitted;

  // Scroll to the review when opened.
  useEffect(() => {
    if (isReviewVisible) {
      reviewRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [isReviewVisible]);

  // Scroll to the submission result.
  useEffect(() => {
    if (bookingResult) {
      resultRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [bookingResult]);

  function handleReview() {
    if (!canReview || isFormLocked) {
      return;
    }

    if (showReview) {
      reviewRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      setShowReview(true);
    }
  }

  async function handleSubmitBooking() {
    if (submitLock.current || isSubmitted) {
      return;
    }

    setNameTouched(true);
    setPhoneTouched(true);
    setBookingResult(null);

    if (!canReview || !isNameValid || !isPhoneValid) {
      setBookingResult({
        status: "error",
        message: "Please check your selections and contact details.",
      });
      return;
    }

    submitLock.current = true;
    setIsSubmitting(true);

    try {
      const values = {
        roomSlug: selectedRoomSlug,
        checkIn,
        checkOut,
        guests: guestCount,
        budget: budgetAmount,
        fullName: trimmedName,
        phone: cleanedPhone,
        includeDinner: isDinnerSelected,
        includeNatureWalk: isNatureWalkSelected,
        expectedTotal: totalCost,
      };

      const payload = JSON.stringify(values);

      // Keep the same ID when retrying unchanged selections.
      let request = requestRef.current;

      if (!request || request.payload !== payload) {
        request = {
          payload,
          id: crypto.randomUUID(),
        };

        requestRef.current = request;
      }

      const result = await submitBooking({
        ...values,
        requestId: request.id,
      });

      setBookingResult(result);
    } catch {
      setBookingResult({
        status: "error",
        message:
          "Connection failed. Please retry without changing your selections.",
      });
    } finally {
      submitLock.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F6EF] text-[#173F35]">
      <Navbar />
      <main className="flex-1">
        <section
          aria-labelledby="planner-title"
          className="relative isolate flex min-h-64 items-center justify-center overflow-hidden md:min-h-80"
        >
          <Image
            src="/images/home-hero.png"
            alt=""
            fill
            preload
            sizes="100vw"
            className="-z-20 object-cover object-[center_42%]"
          />
          <div className="absolute inset-0 -z-10 bg-black/50" />
          <div className="mx-auto max-w-3xl px-6 py-14 text-center text-white">
            <p className="text-xs font-medium uppercase tracking-[0.25em]">
              A little escape, made for you
            </p>
            <h1
              id="planner-title"
              className="hotel-heading mt-5 text-4xl leading-tight sm:text-5xl md:text-6xl"
            >
              Create your perfect stay
            </h1>
            <p className="mt-5 text-sm leading-7 text-white/90 sm:text-base">
              Choose your room, add your favourites, and find a stay that feels
              like you.
            </p>
          </div>
        </section>
        <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-6 md:py-12">
          <ol
            aria-label="Planning guide"
            className="mb-9 grid grid-cols-4 gap-2 border-b border-[#173F35]/15 pb-7 text-center text-xs sm:text-sm"
          >
            {["Stay details", "Room", "Extras", "Review"].map(
              (label, index) => (
                <li key={label} className="flex flex-col items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#173F35]/25 bg-[#FFFEFA] text-xs"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {label}
                </li>
              ),
            )}
          </ol>
          <fieldset
            disabled={isFormLocked}
            aria-busy={isSubmitting}
            className="min-w-0"
          >
            <legend className="sr-only">
              Your stay selections and contact details
            </legend>
            <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_340px]">
              <div className="min-w-0 space-y-6">
                <section
                  aria-labelledby="stay-details-title"
                  className="rounded-xl border border-[#173F35]/15 bg-[#FFFEFA] p-5 sm:p-7"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-[#8A7855]">
                    01 · Start with the essentials
                  </p>
                  <h2
                    id="stay-details-title"
                    className="hotel-heading mt-2 text-3xl"
                  >
                    Stay details
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#66716A]">
                    Choose your dates, guests and budget for one room.
                  </p>
                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    {/* Check-in */}
                    <div className="min-w-0">
                      <label
                        htmlFor="checkIn"
                        className="mb-2 block font-medium"
                      >
                        Check-in date
                      </label>

                      <input
                        id="checkIn"
                        name="checkIn"
                        type="date"
                        value={checkIn}
                        onChange={(event) => setCheckIn(event.target.value)}
                        className={inputClassName}
                      />
                    </div>

                    {/* Check-out */}
                    <div className="min-w-0">
                      <label
                        htmlFor="checkOut"
                        className="mb-2 block font-medium"
                      >
                        Check-out date
                      </label>

                      <input
                        id="checkOut"
                        name="checkOut"
                        type="date"
                        value={checkOut}
                        onChange={(event) => setCheckOut(event.target.value)}
                        aria-invalid={
                          Boolean(checkIn && checkOut) && !areDatesValid
                        }
                        aria-describedby={
                          checkIn && checkOut ? "dates-message" : undefined
                        }
                        className={inputClassName}
                      />

                      {checkIn && checkOut && (
                        <p
                          id="dates-message"
                          className={`mt-4 font-medium ${
                            areDatesValid ? "text-[#173F35]" : "text-red-700"
                          }`}
                        >
                          {areDatesValid
                            ? `Number of nights: ${nights}`
                            : "Check-out must be after check-in."}
                        </p>
                      )}
                    </div>

                    {/* Guests */}
                    <div className="min-w-0">
                      <label
                        htmlFor="guests"
                        className="mb-2 block font-medium"
                      >
                        Number of guests
                      </label>

                      <input
                        id="guests"
                        name="guests"
                        type="number"
                        min={1}
                        max={MAX_INT}
                        step={1}
                        value={guests}
                        onChange={(event) => setGuests(event.target.value)}
                        aria-invalid={!isGuestCountValid}
                        aria-describedby={
                          !isGuestCountValid ? "guests-error" : undefined
                        }
                        className={inputClassName}
                      />

                      {!isGuestCountValid && (
                        <p
                          id="guests-error"
                          className="mt-2 text-sm text-red-700"
                        >
                          Enter a valid whole number of guests, at least 1.
                        </p>
                      )}
                    </div>

                    {/* Budget */}
                    <div className="min-w-0">
                      <label
                        htmlFor="budget"
                        className="mb-2 block font-medium"
                      >
                        Total budget (LKR)
                      </label>

                      <input
                        id="budget"
                        name="budget"
                        type="number"
                        min={1}
                        max={MAX_INT}
                        step={1}
                        placeholder="Example: 65000"
                        value={budget}
                        onChange={(event) => setBudget(event.target.value)}
                        aria-invalid={budget !== "" && !isBudgetValid}
                        aria-describedby={
                          budget !== "" && !isBudgetValid
                            ? "budget-help budget-error"
                            : "budget-help"
                        }
                        className={inputClassName}
                      />

                      {budget !== "" && !isBudgetValid && (
                        <p
                          id="budget-error"
                          className="mt-2 text-sm text-red-700"
                        >
                          Enter a whole-rupee budget between 1 and{" "}
                          {formatMoney(MAX_INT)}.
                        </p>
                      )}

                      <p
                        id="budget-help"
                        className="mt-2 text-sm text-gray-600"
                      >
                        Your budget for the entire stay, including room, meals
                        and activities.
                      </p>
                    </div>
                  </div>
                </section>
                <section
                  aria-labelledby="select-room-title"
                  className="rounded-xl border border-[#173F35]/15 bg-[#FFFEFA] p-5 sm:p-7"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-[#8A7855]">
                    02 · A space to unwind
                  </p>
                  <h2
                    id="select-room-title"
                    className="hotel-heading mt-2 text-3xl"
                  >
                    Select your room
                  </h2>
                  {/* Room selection */}
                  <div className="mt-5">
                    <label htmlFor="room" className="mb-2 block font-medium">
                      Choose your room
                    </label>

                    <select
                      id="room"
                      name="room"
                      value={selectedRoomSlug}
                      disabled={rooms.length === 0}
                      onChange={(event) =>
                        setSelectedRoomSlug(event.target.value)
                      }
                      className={inputClassName}
                    >
                      <option value="">Select a room</option>

                      {rooms.map((room) => (
                        <option key={room.slug} value={room.slug}>
                          {room.name}
                        </option>
                      ))}
                    </select>

                    {rooms.length === 0 && (
                      <p className="mt-2 text-sm text-gray-600">
                        No room types are currently offered. Please contact the
                        hotel.
                      </p>
                    )}

                    {selectedRoom && (
                      <p className="mt-2 text-sm text-gray-600">
                        LKR {formatMoney(selectedRoom.price)} per room per
                        night. Up to {selectedRoom.capacity} guests.
                      </p>
                    )}

                    {selectedRoom &&
                      isGuestCountValid &&
                      guestCount > selectedRoom.capacity && (
                        <p className="mt-2 text-sm text-red-700">
                          This room allows up to {selectedRoom.capacity} guests.
                          Please choose another room or reduce the guest count.
                        </p>
                      )}
                  </div>

                  {selectedRoom && (
                    <div className="mt-5 rounded-lg border border-[#173F35]/10 bg-[#F0F1E9] p-5">
                      <h3 className="hotel-heading text-2xl">
                        {selectedRoom.name}
                      </h3>
                      <p className="mt-2 text-lg">
                        LKR {formatMoney(selectedRoom.price)}{" "}
                        <span className="text-sm text-[#66716A]">/ night</span>
                      </p>
                      <p className="mt-3 text-sm leading-6 text-[#66716A]">
                        Up to {selectedRoom.capacity} guests ·{" "}
                        {selectedRoom.breakfastIncluded
                          ? "Breakfast included"
                          : "Breakfast not included"}
                      </p>
                    </div>
                  )}
                </section>
                <section
                  aria-labelledby="extras-title"
                  className="rounded-xl border border-[#173F35]/15 bg-[#FFFEFA] p-5 sm:p-7"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-[#8A7855]">
                    03 · Make it your own
                  </p>
                  <h2 id="extras-title" className="hotel-heading mt-2 text-3xl">
                    Add your favourites
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#66716A]">
                    A meal to enjoy. A little time in nature. Extras are
                    optional.
                  </p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {/* Meals */}
                    <div className="min-w-0 rounded-lg border border-[#173F35]/15 bg-[#F8F6EF] p-5">
                      <h2 className="hotel-heading text-2xl">Add meals</h2>

                      {selectedRoom && (
                        <p className="mt-3 text-sm text-gray-600">
                          {selectedRoom.breakfastIncluded
                            ? "Breakfast is included in your room price."
                            : "Breakfast is not included in your room price."}
                        </p>
                      )}

                      <label
                        htmlFor="includeDinner"
                        className="mt-4 flex items-start gap-3"
                      >
                        <input
                          id="includeDinner"
                          name="includeDinner"
                          type="checkbox"
                          checked={isDinnerSelected}
                          disabled={!dinner}
                          onChange={(event) =>
                            setIncludeDinner(event.target.checked)
                          }
                          className="mt-1 h-5 w-5 accent-[#173F35] disabled:cursor-not-allowed"
                        />

                        <span>
                          <span className="block font-medium">
                            Add {dinner?.name ?? "dinner"}
                          </span>

                          <span className="block text-sm text-gray-600">
                            {dinner
                              ? `LKR ${formatMoney(dinnerPrice)} per guest per night. Applies to all guests on every night.`
                              : "Dinner is currently unavailable."}
                          </span>
                        </span>
                      </label>

                      <p className="mt-4 text-sm">
                        {isDinnerSelected
                          ? "Dinner selected."
                          : "Dinner not selected."}
                      </p>
                    </div>

                    {/* Activities */}
                    <div className="min-w-0 rounded-lg border border-[#173F35]/15 bg-[#F8F6EF] p-5">
                      <h2 className="hotel-heading text-2xl">Add activities</h2>

                      <label
                        htmlFor="includeNatureWalk"
                        className="mt-4 flex items-start gap-3"
                      >
                        <input
                          id="includeNatureWalk"
                          name="includeNatureWalk"
                          type="checkbox"
                          checked={isNatureWalkSelected}
                          disabled={!natureWalk}
                          onChange={(event) =>
                            setIncludeNatureWalk(event.target.checked)
                          }
                          className="mt-1 h-5 w-5 accent-[#173F35] disabled:cursor-not-allowed"
                        />

                        <span>
                          <span className="block font-medium">
                            {natureWalk?.name ?? "Guided nature walk"}
                          </span>

                          <span className="block text-sm text-gray-600">
                            {natureWalk
                              ? `LKR ${formatMoney(natureWalkPrice)} per guest. One session for all guests during your stay.`
                              : "Nature walk is currently unavailable."}
                          </span>
                        </span>
                      </label>
                    </div>
                  </div>
                </section>
              </div>
              <div className="min-w-0 space-y-5 lg:sticky lg:top-6">
                {/* Your stay so far */}
                {selectedRoom && canCalculate && (
                  <section className="min-w-0 rounded-xl border border-[#173F35]/15 bg-[#FFFEFA] p-6 sm:p-7">
                    <h2 className="hotel-heading text-3xl">Your stay so far</h2>

                    <p className="mt-4 font-medium">{selectedRoom.name}</p>

                    <p className="mt-2 text-sm text-gray-600">
                      {nights} {nights === 1 ? "night" : "nights"} ·{" "}
                      {guestCount} {guestCount === 1 ? "guest" : "guests"} · 1
                      room
                    </p>

                    <div className="mt-6 space-y-3 break-words text-sm leading-6">
                      <p>Room cost: LKR {formatMoney(roomCost)}</p>

                      <p>Dinner cost: LKR {formatMoney(dinnerCost)}</p>

                      <p>Nature walk: LKR {formatMoney(activityCost)}</p>

                      <p className="border-t border-gray-200 pt-3 text-xl font-bold">
                        Total cost: LKR {formatMoney(totalCost)}
                      </p>
                    </div>

                    {!isTotalValid && (
                      <p className="mt-4 text-sm text-red-700">
                        We cannot calculate a valid total for this selection.
                        Please contact the hotel.
                      </p>
                    )}

                    {isBudgetValid ? (
                      <div className="mt-6">
                        <p>Your budget: LKR {formatMoney(budgetAmount)}</p>

                        {remainingBudget >= 0 ? (
                          <p className="mt-2 font-medium text-green-800">
                            Budget remaining: LKR {formatMoney(remainingBudget)}
                          </p>
                        ) : (
                          <p className="mt-2 font-medium text-red-700">
                            Total cost exceeds your budget by LKR{" "}
                            {formatMoney(Math.abs(remainingBudget))}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="mt-6 text-sm text-gray-600">
                        Enter a valid budget to compare it with your total cost.
                      </p>
                    )}

                    <p className="mt-4 text-sm text-gray-600">
                      This estimate includes the room and selected extras. Room
                      and activity availability for your dates will be checked
                      by hotel staff.
                    </p>

                    <button
                      type="button"
                      disabled={!canReview || isFormLocked}
                      onClick={handleReview}
                      className={buttonClassName}
                    >
                      Review My Stay
                    </button>
                  </section>
                )}

                {(!selectedRoom || !canCalculate) && (
                  <section className="rounded-xl border border-[#173F35]/15 bg-[#FFFEFA] p-6 sm:p-7">
                    <h2 className="hotel-heading text-3xl">Your stay so far</h2>
                    <p className="mt-4 text-sm leading-7 text-[#66716A]">
                      Choose valid dates, a guest count that fits your room, and
                      a room to see your price breakdown here.
                    </p>
                    <div className="mt-6 border-t border-[#173F35]/15 pt-5">
                      <p className="hotel-heading text-2xl">
                        A stay shaped around you.
                      </p>
                      <p className="mt-3 text-sm leading-6 text-[#66716A]">
                        Compare your total with your budget before sending a
                        request.
                      </p>
                    </div>
                  </section>
                )}
                <div className="rounded-xl bg-[#EDEFE5] p-6">
                  <p className="hotel-heading text-2xl">
                    A little closer to nature.
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#526459]">
                    Your request goes to the hotel for review. Staff will check
                    availability before confirming your stay.
                  </p>
                </div>
              </div>
            </div>
            {/* Review and contact details */}
            {isReviewVisible && selectedRoom && (
              <section
                ref={reviewRef}
                className="mt-8 scroll-mt-8 rounded-xl border border-[#173F35]/15 bg-[#FFFEFA] p-6 sm:p-8"
              >
                <h2 className="hotel-heading text-3xl sm:text-4xl">
                  Review your stay
                </h2>

                <div className="mt-5 grid gap-3 rounded-lg bg-[#F0F1E9] p-5 text-sm leading-6 sm:grid-cols-2">
                  <p>Room: {selectedRoom.name}</p>
                  <p>Check-in: {checkIn}</p>
                  <p>Check-out: {checkOut}</p>
                  <p>Nights: {nights}</p>
                  <p>Guests: {guestCount}</p>

                  <p>
                    Dinner:{" "}
                    {isDinnerSelected
                      ? "Included in your selection"
                      : "Not selected"}
                  </p>

                  <p>
                    Nature walk:{" "}
                    {isNatureWalkSelected
                      ? "One session selected"
                      : "Not selected"}
                  </p>

                  <p className="text-xl font-bold">
                    Total: LKR {formatMoney(totalCost)}
                  </p>

                  {remainingBudget < 0 && (
                    <p className="text-sm text-red-700">
                      This stay exceeds your budget by LKR{" "}
                      {formatMoney(Math.abs(remainingBudget))}.
                    </p>
                  )}
                </div>

                <p className="mt-4 text-sm text-gray-600">
                  {isSubmitted
                    ? "Your request has been saved. Hotel staff confirmation is still required."
                    : "Submit these selections as a booking request. Your booking is confirmed only after hotel staff approve it."}
                </p>

                <div className="mt-6">
                  <h3 className="hotel-heading text-2xl">
                    Your contact details
                  </h3>

                  <label
                    htmlFor="fullName"
                    className="mb-2 mt-4 block font-medium"
                  >
                    Full name
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    maxLength={100}
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    onBlur={() => setNameTouched(true)}
                    aria-invalid={showNameError}
                    aria-describedby={showNameError ? "name-error" : undefined}
                    className={inputClassName}
                  />

                  {showNameError && (
                    <p id="name-error" className="mt-2 text-sm text-red-700">
                      Enter your full name using 1–100 characters.
                    </p>
                  )}

                  <label
                    htmlFor="phone"
                    className="mb-2 mt-4 block font-medium"
                  >
                    Phone number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    maxLength={40}
                    placeholder="Example: +94771234567"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    onBlur={() => setPhoneTouched(true)}
                    aria-invalid={showPhoneError}
                    aria-describedby={
                      showPhoneError ? "phone-error" : undefined
                    }
                    className={inputClassName}
                  />

                  {showPhoneError && (
                    <p id="phone-error" className="mt-2 text-sm text-red-700">
                      Enter 7–15 digits, optionally starting with +. Spaces,
                      hyphens and parentheses are allowed.
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSubmitBooking}
                  disabled={!canReview || isFormLocked}
                  className={buttonClassName}
                >
                  {isSubmitting
                    ? "Submitting…"
                    : isSubmitted
                      ? "Request submitted"
                      : "Submit booking request"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowReview(false)}
                  disabled={isFormLocked}
                  className="mt-4 font-medium underline disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Close review
                </button>
              </section>
            )}
          </fieldset>
          {/* Result stays outside the disabled fieldset. */}
          <div ref={resultRef} className="scroll-mt-6">
            {bookingResult?.status === "error" && (
              <div
                role="alert"
                className="mt-6 rounded-lg bg-red-50 p-4 text-red-700"
              >
                <p>{bookingResult.message}</p>
              </div>
            )}

            {bookingResult?.status === "success" && (
              <section
                role="status"
                className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-6"
              >
                <h2 className="hotel-heading text-3xl">
                  Booking request received
                </h2>

                <p className="mt-3">Request saved for hotel review.</p>

                <p className="mt-2 break-all text-sm">
                  Reference: {bookingResult.bookingId}
                </p>

                <p className="mt-2 font-semibold">
                  Total: LKR {formatMoney(bookingResult.totalCost)}
                </p>

                <p className="mt-3 text-sm">
                  Hotel staff will check availability before confirming your
                  booking.
                </p>
                <Link
                  href="/my-bookings"
                  className="mt-5 inline-flex min-h-11 items-center font-medium underline underline-offset-4"
                >
                  View My Bookings →
                </Link>
              </section>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
