import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/notifications/stream
 * Server-Sent Events endpoint for real-time notifications
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;
    let lastCheck = new Date();

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        // Function to send notifications
        const sendNotifications = async () => {
          try {
            // Get new notifications since last check
            const notifications = await prisma.notification.findMany({
              where: {
                userId,
                createdAt: {
                  gte: lastCheck,
                },
              },
              orderBy: {
                createdAt: "desc",
              },
            });

            // Get unread count
            const unreadCount = await prisma.notification.count({
              where: {
                userId,
                isRead: false,
              },
            });

            lastCheck = new Date();

            // Send data
            const data = {
              notifications,
              unreadCount,
              timestamp: lastCheck.toISOString(),
            };

            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
            );
          } catch (error) {
            console.error("Error fetching notifications:", error);
          }
        };

        // Send initial notifications
        await sendNotifications();

        // Poll every 5 seconds
        const interval = setInterval(async () => {
          await sendNotifications();
        }, 5000);

        // Cleanup on close
        request.signal.addEventListener("abort", () => {
          clearInterval(interval);
          controller.close();
        });
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in notifications stream:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
