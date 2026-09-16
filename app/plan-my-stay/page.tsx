import StayPlanner from "../components/StayPlanner";
import { prisma } from "../lib/prisma";

export default async function PlanMyStayPage() {
    const [roomTypes, dinner, natureWalk] = await Promise.all([
        prisma.roomType.findMany({
            where: {
                rooms: {
                    some: {
                        isActive: true,
                    },
                },
            },
            select: {
                name: true,
                slug: true,
                pricePerNight: true,
                capacity: true,
                breakfastIncluded: true,
            },
            orderBy: {
                pricePerNight: "asc",
            },
        }),

        prisma.meal.findFirst({
            where: {
                slug: "dinner",
                isActive: true,
            },
            select: {
                name: true,
                pricePerGuestPerNight: true,
            },
        }),

        prisma.activity.findFirst({
            where: {
                slug: "guided-nature-walk",
                isActive: true,
            },
            select: {
                name: true,
                pricePerGuestPerSession: true,
            },
        }),
    ]);

    const rooms = roomTypes.map((roomType) => ({
        name: roomType.name,
        slug: roomType.slug,
        price: roomType.pricePerNight,
        capacity: roomType.capacity,
        breakfastIncluded: roomType.breakfastIncluded,
    }));

    return (
        <StayPlanner
            rooms={rooms}
            dinner={dinner}
            natureWalk={natureWalk}
        />
    );
}