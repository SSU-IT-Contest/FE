import { api } from "@/apis/api";
import { AxiosError } from "axios";

// 회원 정보 조회
export const getMemberInfo = async (memberId: number) => {
  try {
    const response = await api.get(`/members/${memberId}`);
    console.log("회원 정보 조회 성공:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    console.error("회원 정보 조회 실패:", axiosError.response?.data || axiosError.message);
    return {
      success: false,
      error: axiosError.response?.data?.message || "회원 정보를 불러올 수 없습니다."
    };
  }
};

// 결제 관련 API 함수들
export const updateUserPlan = async (memberId: number, planId: number) => {
  try {
    const response = await api.patch(`/members/${memberId}/plan`, { planId });

    console.log("요금제 업데이트 성공:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    console.error("요금제 업데이트 실패:", axiosError.response?.data || axiosError.message);
    return {
      success: false,
      error: axiosError.response?.data?.message || "네트워크 오류가 발생했습니다."
    };
  }
};

// 토큰 재발급 함수
export const reissueAccessToken = async () => {
  try {
    const response = await api.post(
      "/members/reissue",
      {},
      {
        withCredentials: true
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    console.error("토큰 재발급 중 오류:", axiosError);
    return {
      success: false,
      error: axiosError.response?.data?.message || "토큰 재발급 실패"
    };
  }
};
