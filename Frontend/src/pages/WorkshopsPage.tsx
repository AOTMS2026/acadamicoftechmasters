import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/navbar/Navbar";
import { Footer } from "@/components/Footer";
import { WorkshopManager, EventItem } from "@/components/events/WorkshopManager";
import { CertificateShowcase } from "@/components/CertificateShowcase";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import axios from "axios";
import { SEO } from "@/components/SEO";

// Static workshop entry for "Master DSA Using Python"
const STATIC_WORKSHOPS: EventItem[] = [
    {
        id: "static-dsa-python-001",
        name: "Master DSA Using Python",
        description:
            "Crack coding interviews and build a strong algorithmic foundation with Python. This intensive hands-on workshop covers all major Data Structures & Algorithms — from arrays and linked lists to trees, graphs, dynamic programming, and beyond — using Python's clean syntax and powerful standard library.",
        thumbnailUrl: "https://res.cloudinary.com/dqhyudo4x/image/upload/v1/aotms/workshops/dsa-python-thumb",
        bannerUrl: "https://res.cloudinary.com/dqhyudo4x/image/upload/v1/aotms/workshops/dsa-python-banner",
        mode: "Online",
        date: "Coming Soon",
        duration: "2 Days",
        tagline: "DSA INTENSIVE WORKSHOP",
        whatYouWillLearn: [
            "Arrays, Strings & Hashing",
            "Linked Lists & Stacks/Queues",
            "Trees, Heaps & Graphs",
            "Sorting & Searching Algorithms",
            "Dynamic Programming & Recursion",
            "Python-specific Optimisations",
            "Interview Problem-Solving Patterns",
            "Certificate of Completion",
        ],
        level: "Beginner to Advanced",
        isRegistrationOpen: true,
        showRegisterButton: true,
        detailsUrl: "https://tech-masters-demo.vercel.app/",
    },
];

const WorkshopsPage = () => {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { token } = useAuthStore();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/events?type=workshop&all=true`);

                const adaptedEvents = response.data.map((item: { _id?: string; id?: string; name: string; description?: string; thumbnailUrl?: string; bannerUrl?: string; mode?: string; date?: string; duration?: string; tagline?: string; whatYouWillLearn?: string[]; level?: string; isRegistrationOpen?: boolean; }) => ({
                    id: item.id || item._id,
                    name: item.name,
                    description: item.description || "Join this intensive workshop to master new skills.",
                    thumbnailUrl: item.thumbnailUrl || "/images/placeholder-thumb.jpg",
                    bannerUrl: item.bannerUrl || item.thumbnailUrl || "/images/placeholder-banner.jpg",
                    mode: item.mode || "Online",
                    date: item.date || "TBA",
                    duration: item.duration || "One Day",
                    tagline: item.tagline || "INTENSIVE WORKSHOP SERIES",
                    whatYouWillLearn: item.whatYouWillLearn || ["Industry Standard Tools", "Professional Workflow", "Certificate of Completion"],
                    level: item.level || "Beginner to Pro",
                    isRegistrationOpen: item.isRegistrationOpen
                }));

                // Merge: static DSA workshop first, then API workshops
                // Avoid duplicates if it was already seeded in the DB
                const apiIds = new Set(adaptedEvents.map((e: EventItem) => e.name.toLowerCase().trim()));
                const filteredStatic = STATIC_WORKSHOPS.filter(
                    (sw) => !apiIds.has(sw.name.toLowerCase().trim())
                );
                setEvents([...filteredStatic, ...adaptedEvents]);
            } catch (error) {
                console.error("Failed to fetch workshops", error);
                // Show static workshops even if API fails
                setEvents(STATIC_WORKSHOPS);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [token, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="pt-32 container mx-auto text-center">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="h-8 w-64 bg-slate-200 rounded mb-4"></div>
                        <div className="h-64 w-full max-w-4xl bg-slate-100 rounded-2xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <SEO
                title="Professional Tech Workshops"
                description="Join expert-led tech workshops at Academy of Tech Masters in Vijayawada. Gain hands-on experience in the latest technologies and industry practices."
                keywords="tech workshops Vijayawada, specialized IT training, hands-on workshops AOTMS"
                canonical="https://aotms.in/workshops"
            />
            <Header />
            <main className="pt-28 md:pt-32">
                <WorkshopManager
                    events={events}
                    title="Workshops"
                    subtitle="Master in-demand skills with our expert-led intensive workshops."
                />
                <CertificateShowcase />
            </main>
            <Footer />
        </div>
    );
};

export default WorkshopsPage;