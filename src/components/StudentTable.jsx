import StudentItem from './StudentItem';

const StudentTable = ({ students, onDelete }) => {
  return (
    <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%', marginTop: '15px' }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Họ tên</th>
          <th>Điểm số</th>
          <th>Lớp</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {/* Dùng .map() của ES6 để lặp qua danh sách và vẽ từng dòng */}
        {students.map((sv) => (
          <StudentItem 
            key={sv.id}
            student={sv}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </table>
  );
};

export default StudentTable;