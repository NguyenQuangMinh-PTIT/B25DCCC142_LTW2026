import { useState } from 'react';
import StudentTable from './components/StudentTable';

const App = () => {
  const [students, setStudents] = useState([
    { id: 1, name: 'Nguyễn Văn An', score: 8.5, class: 'CNTT1' },
    { id: 2, name: 'Trần Thị Bình', score: 6.5, class: 'CNTT2' },
    { id: 3, name: 'Lê Văn Cường', score: 4.0, class: 'CNTT1' }
  ]);

  const [name, setName] = useState('');
  const [score, setScore] = useState('');
  const [lop, setLop] = useState('');

  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const handleAdd = (e) => {
    e.preventDefault(); 

    if (name.trim() === '' || score === '' || lop.trim() === '') {
      setError('Không được để trống thông tin nào!');
      return; 
    }

    const diemSo = Number(score);
    if (diemSo < 0 || diemSo > 10) {
      setError(`Điểm số ${diemSo} không hợp lệ! Phải từ 0 đến 10.`);
      return; 
    }

    const newStudent = {
      id: Date.now(), 
      name: name,
      score: diemSo,
      class: lop
    };

    setStudents([...students, newStudent]);
    setName('');
    setScore('');
    setLop('');
    setError('');
  };

  const handleDelete = (idCanXoa) => {
    const danhSachMoi = students.filter((sv) => sv.id !== idCanXoa);
    setStudents(danhSachMoi);
  };

  const filteredStudents = students.filter((sv) => {
    if (filter === 'gioi') return sv.score >= 8;
    if (filter === 'truot') return sv.score < 5;
    return true;
  });

  const totalCount = students.length; 
  const totalScore = students.reduce((tong, sv) => tong + sv.score, 0);
  const avgScore = totalCount > 0 ? (totalScore / totalCount).toFixed(2) : 0;

  return (
    <div style={{ maxWidth: '750px', margin: '20px auto', fontFamily: 'sans-serif' }}>
      <h2>Ứng dụng Quản lý Điểm Sinh viên</h2>

      {/* Form nhập liệu */}
      <form onSubmit={handleAdd} style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Họ tên..."
          value={name}
          onChange={(e) => setName(e.target.value)} 
          style={{ marginRight: '8px', padding: '5px' }}
        />
        <input
          type="number"
          step="0.1"
          placeholder="Điểm (0-10)..."
          value={score}
          onChange={(e) => setScore(e.target.value)} 
          style={{ marginRight: '8px', padding: '5px' }}
        />
        <input
          type="text"
          placeholder="Lớp..."
          value={lop}
          onChange={(e) => setLop(e.target.value)} 
          style={{ marginRight: '8px', padding: '5px' }}
        />
        <button type="submit" style={{ padding: '5px 12px' }}>Thêm</button>
      </form>

      {/* Báo lỗi */}
      {error !== '' && <p style={{ color: 'red', fontWeight: 'bold' }}>{`Lỗi: ${error}`}</p>}

      {/* Thống kê */}
      <p style={{ fontWeight: 'bold' }}>
        {`Tổng số sinh viên: ${totalCount} | Điểm trung bình toàn lớp: ${avgScore}`}
      </p>

      {/* Bộ lọc */}
      <div style={{ marginBottom: '10px' }}>
        <span>Bộ lọc: </span>
        <button onClick={() => setFilter('all')} style={{ marginRight: '5px' }}>Tất cả</button>
        <button onClick={() => setFilter('gioi')} style={{ marginRight: '5px' }}>Sinh viên Giỏi (&gt;= 8)</button>
        <button onClick={() => setFilter('truot')}>Sinh viên Trượt (&lt; 5)</button>
      </div>

      {/* Bảng danh sách */}
      <StudentTable 
        students={filteredStudents} 
        onDelete={handleDelete} 
      />
    </div>
  );
};

export default App;