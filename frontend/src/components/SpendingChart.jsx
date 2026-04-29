import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const SpendingChart = ({ transactions }) => {
    // Process data: Group expenses by category
    const categoryData = transactions
        .filter(t => parseFloat(t.amount) < 0)
        .reduce((acc, t) => {
            const amt = Math.abs(parseFloat(t.amount));
            const existing = acc.find(item => item.name === t.category);
            if (existing) {
                existing.value += amt;
            } else {
                acc.push({ name: t.category, value: amt });
            }
            return acc;
        }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SpendingChart;