"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, CheckCircle } from "lucide-react";
import { updateUserPlan } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";

interface FreeBetaButtonProps {
  planId: number;
  planName: string;
  billingCycle: "monthly" | "yearly";
}

const FreeBetaButton = ({ planId, planName, billingCycle }: FreeBetaButtonProps) => {
  const router = useRouter();
  const { accessToken, setPlanTier } = useAuthStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFreePlanActivation = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      setError(null);

      // 로그인 확인
      if (!accessToken) {
        setError("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      // memberId 가져오기
      const memberId = localStorage.getItem("memberId");
      if (!memberId) {
        setError("회원 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
        return;
      }

      // 플랜 업데이트 API 호출
      console.log("🚀 플랜 업데이트 시작:", { memberId, planId });
      const updateResult = await updateUserPlan(parseInt(memberId), planId);

      if (!updateResult.success) {
        setError(updateResult.error || "플랜 업데이트에 실패했습니다. 다시 시도해주세요.");
        return;
      }

      console.log("✅ 플랜 업데이트 성공");

      // 전역 상태 업데이트
      const planTierMap: Record<number, "Free" | "Basic" | "Standard" | "Pro"> = {
        1: "Free",
        2: "Basic",
        3: "Standard",
        4: "Pro"
      };
      const newTier = planTierMap[planId] || "Free";
      setPlanTier(newTier);

      // localStorage도 업데이트 (새로고침 시 유지용)
      localStorage.setItem("planId", planId.toString());

      console.log("✅ 전역 상태 및 localStorage 업데이트 완료:", { planId, newTier });

      // 성공 페이지로 리다이렉트
      const params = new URLSearchParams({
        mode: "beta-free",
        plan: planName.toLowerCase().replace("phraiz ", ""),
        cycle: billingCycle,
        planId: planId.toString()
      });

      console.log("🔀 성공 페이지로 이동");
      router.push(`/payment/success?${params.toString()}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
      console.error("💥 플랜 활성화 실패:", error);
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button onClick={handleFreePlanActivation} disabled={isProcessing} className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all">
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            플랜 활성화 중...
          </>
        ) : (
          <>
            <CheckCircle className="mr-2 h-5 w-5" />
            🎉 무료로 시작하기
          </>
        )}
      </Button>

      <div className="text-xs text-center text-gray-500 space-y-1">
        <p>✨ 베타 기간 동안 {planName} 플랜의 모든 기능을 무료로 이용할 수 있습니다</p>
        <p>💳 결제 정보 입력 없이 바로 시작하세요</p>
      </div>
    </div>
  );
};

export default FreeBetaButton;
