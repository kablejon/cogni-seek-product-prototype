"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function TestApiPage() {
  const [status, setStatus] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<boolean | null>(null)

  const testApi = async () => {
    setLoading(true)
    setStatus("正在测试 API 连接...")
    setResult(null)
    setSuccess(null)

    try {
      // 使用简单的测试端点
      const response = await fetch('/api/test')
      const data = await response.json()
      
      setResult(data)
      
      if (data.success) {
        setStatus("API 连接正常！")
        setSuccess(true)
      } else {
        setStatus(`错误: ${data.error}`)
        setSuccess(false)
      }
    } catch (error: any) {
      setStatus(`调用失败: ${error.message}`)
      setResult({ error: error.message })
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">API 连接测试</h1>
        <p className="text-muted-foreground">测试 OpenRouter API 和 Gemini 2.0 模型连接状态</p>
        
        <Button onClick={testApi} disabled={loading} size="lg">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              测试中...
            </>
          ) : (
            "测试 API 连接"
          )}
        </Button>

        {status && (
          <div className={`p-4 rounded-lg border flex items-center gap-3 ${
            success === true ? 'bg-green-50 border-green-200 text-green-800' :
            success === false ? 'bg-red-50 border-red-200 text-red-800' :
            'bg-card'
          }`}>
            {success === true && <CheckCircle className="h-5 w-5 text-green-600" />}
            {success === false && <XCircle className="h-5 w-5 text-red-600" />}
            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
            <p className="font-semibold">{status}</p>
          </div>
        )}

        {result && (
          <div className="p-4 bg-card rounded-lg border">
            <p className="font-semibold mb-2">详细信息:</p>
            <pre className="text-sm overflow-auto whitespace-pre-wrap bg-muted p-3 rounded">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="text-sm text-muted-foreground space-y-1">
          <p>• 模型: google/gemini-2.0-flash-001</p>
          <p>• 提供商: OpenRouter</p>
          <p>• 配置文件: .env.local</p>
        </div>
      </div>
    </div>
  )
}



