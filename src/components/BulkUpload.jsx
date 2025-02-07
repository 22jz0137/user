import React, { useState } from 'react';

const BulkUpload = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // CSVファイル選択ハンドラー
  const handleFileChange = (event) => {
    setCsvFile(event.target.files[0]);
  };

  // CSVファイルのアップロード処理
  const handleBulkUpload = async () => {
    if (!csvFile) {
      alert('CSVファイルを選択してください');
      return;
    }

    const formData = new FormData();
    formData.append('file', csvFile);

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://your-api-endpoint.com/api/upload-classdays', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'CSVアップロードに失敗しました');
      }

      alert('CSVファイルのアップロードが完了しました');
    } catch (error) {
      setError('エラーが発生しました: ' + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".csv" />
      <button onClick={handleBulkUpload} disabled={loading} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        {loading ? 'アップロード中...' : 'CSVをアップロード'}
      </button>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default BulkUpload;
