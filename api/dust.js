// Vercel Serverless Function: api/dust.js
// 사용자의 요청 URL (/api/dust?sido=서울) 호환을 위한 엔드포인트
import dogcatHandler from './dogcat.js';

export default async function handler(req, res) {
  return dogcatHandler(req, res);
}
