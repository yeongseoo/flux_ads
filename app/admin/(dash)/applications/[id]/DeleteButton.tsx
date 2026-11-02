"use client";

import { Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export function DeleteButton({ name }: { name: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      className="btn btn-danger btn-sm"
      disabled={pending}
      onClick={(e) => {
        if (!confirm(`'${name}' 님의 신청 정보를 영구 삭제합니다. 이 작업은 되돌릴 수 없습니다. 계속할까요?`)) e.preventDefault();
      }}
    >
      <Trash2 aria-hidden="true" /> {pending ? "삭제 중..." : "신청 정보 삭제"}
    </button>
  );
}
