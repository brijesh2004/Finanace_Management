import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import style from '../style/about.module.css';
import Charts from './Charts';
import { Link } from "react-router-dom";

const About = () => {
  const [userdata, setUserData] = useState([]);
  const [userName, setUserName] = useState("");
  const [total, setTotal] = useState();
  const [year, setYear] = useState("All");
  const [month, setMonth] = useState("All");
  const [datafind , setDataFind] = useState(false);
  const [incomeOrExpense, setIncomeOrExpense] = useState("All");
  const navigate = useNavigate();
  const logind = useSelector((state: any) => state.login);

  const Aboutdata = async () => {
    try {
      const backend = import.meta.env.VITE_BACKEND;
      const response = await axios.get(`${backend}/profile`, {
        withCredentials: true,
      });
      const data = response.data;
      setTotal(data.total);
      setUserName(data.name.name);
      setUserData(data.details);
      setDataFind(true);
    } catch (error) {
      console.error("Error fetching data", error);
      setDataFind(false);
    }
  };

  useEffect(() => {
    Aboutdata();
  }, []);

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const UpdateData = (user: any) => {
    navigate("/add", { state: { amountValue: user.amount, types: user.types, incomeSource: user.incomeorexpanse, inexId: user._id } });
  };

  const deleteItem = async (exId: String) => {
    try {
      const backend = import.meta.env.VITE_BACKEND;
      const res = await axios.post(`${backend}/delete`, { exId }, { withCredentials: true });
      alert("Deleted");
      window.location.reload();
    } catch (err) {
      alert("Error while deleting");
    }
  };

  useEffect(() => {
    if (!logind) {
      navigate("/");
    }
  }, [logind]);

  const filterData = (data: any) => {
    return data.filter((user: any) => {
      const date = new Date(user.date);
      const userYear = date.getFullYear();
      const userMonth = date.getMonth() + 1; // getMonth returns month from 0-11

      const isYearMatch = year === "All" || year === userYear.toString();
      const isMonthMatch = month === "All" || month === userMonth.toString();
      const isIncomeOrExpenseMatch = incomeOrExpense === "All" || incomeOrExpense === user.incomeorexpanse;

      return isYearMatch && isMonthMatch && isIncomeOrExpenseMatch;
    });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(e.target.value);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMonth(e.target.value);
  };

  const handleIncomeOrExpenseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIncomeOrExpense(e.target.value);
  };

  const filteredUserData = filterData(userdata);

  const incomeData = filteredUserData.filter((item: any) => item.incomeorexpanse === 'income');
  const expenseData = filteredUserData.filter((item: any) => item.incomeorexpanse === 'expanse');

  // Function to convert data to CSV format
  const downloadCSV = () => {
    const headers = ['Name', 'Type', 'Updated Date', 'Amount'];
    const rows = filteredUserData.map((user: any) => [
      user.incomeorexpanse,
      user.types,
      formatDate(user.date),
      user.amount
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row:any) => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'user_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
   <div>
    { datafind===true?
    <div style={{ textAlign: "center" }}>
      <h1>Name: {userName}</h1>
      <h2>Total Saving: {total}  ₹</h2>

      <div style={{ margin: "20px" }}>
        <label htmlFor="year">Year:</label>
        <select id="year" value={year} onChange={handleYearChange}>
          <option value="All">All</option>
          {/* Add other years dynamically or statically */}
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
        </select>

        <label htmlFor="month">Month:</label>
        <select id="month" value={month} onChange={handleMonthChange}>
          <option value="All">All</option>
          {/* Add month options */}
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>

        <label htmlFor="incomeOrExpense">Income/Expense:</label>
        <select id="incomeOrExpense" value={incomeOrExpense} onChange={handleIncomeOrExpenseChange}>
          <option value="All">All</option>
          <option value="income">Income</option>
          <option value="expanse">Expense</option>
        </select>
      </div>
      <button onClick={downloadCSV} className={style.download_btn}>Download CSV</button>
 <div className={style.table_head}>
      <table style={{ margin: "0 auto", borderCollapse: "collapse", width: "80%" }}>
        <thead>
          <tr>
            <th className={style.abouttable}>Name</th>
            <th className={style.abouttable}>Type</th>
            <th className={style.abouttable}>Updated Date</th>
            <th className={style.abouttable}>Amount  (₹)</th>
            <th className={style.abouttable}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUserData.map((user: any) => (
            <tr key={user._id}>
              <td className={style.abouttable}>{user.incomeorexpanse}</td>
              <td className={style.abouttable}>{user.types}</td>
              <td className={style.abouttable}>{formatDate(user.date)}</td>
              <td className={style.abouttable}>{user.amount}</td>
              <td className={style.abouttable}>
                <button onClick={() => UpdateData(user)}>Update</button>
                <button onClick={() => deleteItem(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <Charts incomeData={incomeData} expenseData={expenseData} />
    </div>:
    <div style={{textAlign:'center'}}>
      <h1 >Add Data to see the Profile</h1>
      <Link to="/add">Add</Link>
      </div>
}
    </div>
        
  );
};

export default About;
