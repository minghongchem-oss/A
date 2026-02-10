export default function CreatePackPage() {
  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-semibold">创建地图包</h2>
      <p className="text-sm text-muted-foreground">登录后可设置名称、可见性、区域约束或导入 CSV。</p>
      <form className="grid gap-2 max-w-lg">
        <input className="rounded border p-2" placeholder="名称" />
        <textarea className="rounded border p-2" placeholder="描述" rows={4} />
        <button className="rounded bg-black p-2 text-white">保存（示例）</button>
      </form>
    </div>
  );
}
