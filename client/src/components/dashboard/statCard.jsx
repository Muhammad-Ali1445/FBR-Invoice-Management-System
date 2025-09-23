import CountUp from "react-countup";
import { motion } from "framer-motion";
export const StatCard = ({ icon, label, value }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="p-4 bg-card/70 rounded-xl shadow border flex items-center justify-between"
  >
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <h3 className="text-2xl font-bold text-foreground">
        <CountUp end={value} duration={1.2} />
      </h3>
    </div>
    <div className="p-2 rounded-full bg-primary/10 text-primary">{icon}</div>
  </motion.div>
);
