import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

interface MiniAppWalletAuthSuccessPayload {
  status: 'success'
  message: string
  signature: string
  address: string
  version: number
}

interface IRequestPayload {
  payload: MiniAppWalletAuthSuccessPayload
  nonce: string
}

// 簡易的な検証関数 - 実際のプロダクションでは適切な検証ライブラリを使用する
const verifySiweMessage = async (payload: MiniAppWalletAuthSuccessPayload, nonce: string) => {
  // 実際のプロダクションではethersjsやsiweライブラリを使用して適切に検証する
  // 現時点では単純にペイロードとnonceが存在するかどうかをチェックする簡易版
  if (!payload || !nonce) {
    return { isValid: false };
  }
  
  if (payload.status !== 'success' || !payload.message || !payload.signature || !payload.address) {
    return { isValid: false };
  }
  
  // 本来はここでSIWEメッセージの署名を検証する
  return { isValid: true, address: payload.address };
};

export const POST = async (req: NextRequest) => {
  const { payload, nonce } = (await req.json()) as IRequestPayload;
  
  if (nonce !== cookies().get('siwe')?.value) {
    return NextResponse.json({
      status: 'error',
      isValid: false,
      message: 'Invalid nonce',
    });
  }
  
  try {
    const validMessage = await verifySiweMessage(payload, nonce);
    
    if (validMessage.isValid) {
      // ユーザーの認証に成功した場合、ウォレットアドレスを返す
      return NextResponse.json({
        status: 'success',
        isValid: true,
        address: validMessage.address
      });
    } else {
      return NextResponse.json({
        status: 'error',
        isValid: false,
        message: 'Invalid signature'
      });
    }
  } catch (error: any) {
    // 検証エラーの処理
    return NextResponse.json({
      status: 'error',
      isValid: false,
      message: error.message,
    });
  }
} 