import { useState, useContext } from "react";
import { useSelector } from "react-redux";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { AuthContext } from "../../App";
import { motion } from "framer-motion";

const Header = ({ onMobileMenuToggle, searchQuery, onSearchChange }) => {
  const [notifications] = useState([
    { id: 1, message: "Emergency admission in ER", type: "urgent" },
    { id: 2, message: "Bed 205 ready for cleaning", type: "info" }
  ]);

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileMenuToggle}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          
          <div className="hidden md:block">
            <SearchBar
              placeholder="Search patients, appointments..."
              onSearch={onSearchChange}
              className="w-96"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Button variant="ghost" size="sm">
              <ApperIcon name="Bell" size={20} />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </Button>
          </div>
          
<div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={18} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{useSelector(state => state.user.user?.firstName || 'User')} {useSelector(state => state.user.user?.lastName || '')}</p>
              <p className="text-xs text-gray-500">Hospital Staff</p>
            </div>
            <Button variant="ghost" size="sm" onClick={useContext(AuthContext).logout}>
              <ApperIcon name="LogOut" size={16} />
            </Button>
          </div>
        </div>
      </div>

      <div className="md:hidden mt-4">
        <SearchBar
          placeholder="Search patients, appointments..."
          onSearch={onSearchChange}
        />
      </div>
    </motion.header>
  );
};

export default Header;