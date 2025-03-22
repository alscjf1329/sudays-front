"use client";

import { redirect } from "next/navigation";

export default function DiaryPage() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    redirect(`/diary/${year}/${month}`);
}
