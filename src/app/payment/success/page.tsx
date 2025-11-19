"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mode = searchParams.get("mode"); // "beta-free" or null
  const plan = searchParams.get("plan");
  const cycle = searchParams.get("cycle");
  const planId = searchParams.get("planId");

  useEffect(() => {
    // 베타 무료 모드인 경우 바로 완료
    if (mode === "beta-free") {
      setIsLoading(false);
      return;
    }

    // 일반 결제 모드 (토스페이먼츠 검증)
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    if (!paymentKey || !orderId || !amount) {
      setError("결제 정보가 올바르지 않습니다.");
      setIsLoading(false);
      return;
    }

    // 토스 결제 검증 로직 (향후 정식 출시 시 사용)
    // verifyPayment();
    setIsLoading(false);
  }, [mode, searchParams]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">처리 중...</h2>
          <p className="text-gray-600">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="text-center mt-6">
          <Button onClick={() => router.push("/")} variant="outline">
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{mode === "beta-free" ? "플랜이 활성화되었습니다!" : "결제가 완료되었습니다!"}</h1>
        <p className="text-gray-600">{plan && `${plan.toUpperCase()} 플랜으로 업그레이드되었습니다.`}</p>
      </div>

      {mode === "beta-free" && (
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <CheckCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">🎉 베타 기간 동안 모든 기능을 무료로 이용하실 수 있습니다!</AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>플랜 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">선택한 플랜</p>
              <p className="font-medium text-lg flex items-center gap-2">
                {plan?.toUpperCase()}
                {mode === "beta-free" && <Badge className="bg-blue-100 text-blue-700 text-xs">무료</Badge>}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">결제 주기</p>
              <p className="font-medium">{cycle === "yearly" ? "연간" : "월간"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">플랜 ID</p>
              <p className="font-medium">{planId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">상태</p>
              <p className="font-medium text-green-600">활성화 완료</p>
            </div>
          </div>

          {mode === "beta-free" && (
            <div className="border-t pt-4 mt-4">
              <p className="text-sm text-gray-600 mb-2">베타 혜택</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✅ 모든 프리미엄 기능 무료 제공</li>
                <li>✅ 결제 정보 불필요</li>
                <li>✅ 베타 기간 종료 전 공지 예정</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <Button onClick={() => router.push("/")} className="w-full">
          <Home className="mr-2 h-4 w-4" />
          서비스 이용하기
        </Button>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
