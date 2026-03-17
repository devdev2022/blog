/**
 * 닉네임에서 이니셜을 추출합니다.
 * - 영문 여러 단어: 각 단어 첫 글자 (최대 2자) ex) John Doe → JD
 * - 영문 한 단어 / 한글: 첫 글자 ex) Claude → C, 홍길동 → 홍
 */
export function getInitials(nickname: string): string {
  const trimmed = nickname.trim();
  if (!trimmed) return "?";

  const words = trimmed.split(/\s+/);

  if (words.length >= 2) {
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }

  return trimmed.charAt(0).toUpperCase();
}
