import React, { useState, createContext, useContext, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Switch,
  Alert,
  Modal,
  Pressable,
  useColorScheme,
} from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// Create Theme Context to handle dark mode toggle
const ThemeContext = createContext();

const transactions = [
  { id: '1', title: 'Starbucks', amount: '-$5.40', type: 'expense', date: '2025-05-20' },
  { id: '2', title: 'Salary', amount: '+$1200.00', type: 'income', date: '2025-05-18' },
  { id: '3', title: 'Netflix', amount: '-$12.99', type: 'expense', date: '2025-05-17' },
  { id: '4', title: 'Cashback', amount: '+$3.50', type: 'income', date: '2025-05-16' },
  { id: '5', title: 'Amazon', amount: '-$48.23', type: 'expense', date: '2025-05-15' },
];

function HomeScreen({ navigation }) {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  // Calculate totals for summary
  const incomeTotal = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[^0-9.-]+/g, '')), 0);
  const expenseTotal = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount.replace(/[^0-9.-]+/g, ''))), 0);

  // Modal state for actions
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);

  function openModal(type) {
    setModalType(type);
    setModalVisible(true);
  }
  function closeModal() {
    setModalVisible(false);
    setModalType(null);
  }

  const styles = isDark ? darkStyles : lightStyles;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.openDrawer()}
        activeOpacity={0.7}
      >
        <Ionicons name="menu" size={28} color={isDark ? '#fff' : '#000'} />
      </TouchableOpacity>

      <Text style={styles.greeting}>Hi Nelson 👋</Text>
      <Text style={styles.subtitle}>Here’s your current balance</Text>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Balance</Text>
        <Text style={styles.balanceAmount}>$5,430.55</Text>
      </View>

      <View style={styles.summaryRow}>
        <View style={[styles.summaryBox, { backgroundColor: '#28c76f20' }]}>
          <Text style={[styles.summaryTitle, { color: '#28c76f' }]}>Income</Text>
          <Text style={[styles.summaryAmount, { color: '#28c76f' }]}>${incomeTotal.toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryBox, { backgroundColor: '#ff5c5c20' }]}>
          <Text style={[styles.summaryTitle, { color: '#ff5c5c' }]}>Expenses</Text>
          <Text style={[styles.summaryAmount, { color: '#ff5c5c' }]}>${expenseTotal.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => openModal('Send')}>
          <Ionicons name="send" size={20} color="#fff" />
          <Text style={styles.actionText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => openModal('Receive')}>
          <MaterialIcons name="call-received" size={20} color="#fff" />
          <Text style={styles.actionText}>Receive</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => openModal('Top Up')}>
          <MaterialIcons name="account-balance-wallet" size={20} color="#fff" />
          <Text style={styles.actionText}>Top Up</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Send/Receive/Top Up */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDark && darkStyles.modalContent]}>
            <Text style={[styles.modalTitle, isDark && darkStyles.modalTitle]}>
              {modalType} Money
            </Text>
            <Text style={[styles.modalText, isDark && darkStyles.modalText]}>
              {modalType === 'Send' &&
                'Send money securely to your contacts or bank accounts instantly.'}
              {modalType === 'Receive' &&
                'Receive money from anyone using your unique account ID or QR code.'}
              {modalType === 'Top Up' &&
                'Add funds to your account using debit card, credit card or bank transfer.'}
            </Text>
            <Pressable style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.modalButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function TransactionsScreen({ navigation }) {
  const { isDark } = useContext(ThemeContext);
  const styles = isDark ? darkStyles : lightStyles;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.openDrawer()}
        activeOpacity={0.7}
      >
        <Ionicons name="menu" size={28} color={isDark ? '#fff' : '#000'} />
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <View>
              <Text style={styles.transactionTitle}>{item.title}</Text>
              <Text style={styles.transactionDate}>{item.date}</Text>
            </View>
            <Text
              style={[
                styles.transactionAmount,
                item.type === 'expense' ? styles.expense : styles.income,
              ]}
            >
              {item.amount}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

function SettingsScreen({ navigation }) {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const styles = isDark ? darkStyles : lightStyles;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.openDrawer()}
        activeOpacity={0.7}
      >
        <Ionicons name="menu" size={28} color={isDark ? '#fff' : '#000'} />
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Settings</Text>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={() => setNotificationsEnabled((prev) => !prev)}
          thumbColor={notificationsEnabled ? '#4a90e2' : '#f4f3f4'}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Dark Mode</Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          thumbColor={isDark ? '#4a90e2' : '#f4f3f4'}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Currency</Text>
        <Text style={{ fontSize: 18, color: styles.settingLabel.color }}>$ USD</Text>
      </View>
    </View>
  );
}

function AboutScreen() {
  const { isDark } = useContext(ThemeContext);
  const styles = isDark ? darkStyles : lightStyles;

  return (
    <View style={styles.centered}>
      <Text style={styles.screenText}>Fintech App v1.0</Text>
      <Text style={styles.screenText}>Made with ❤️ by Nelson Chege</Text>
      <Text style={styles.screenText}>© 2025</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function Tabs() {
  const { isDark } = useContext(ThemeContext);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#4a90e2',
        tabBarInactiveTintColor: isDark ? '#aaa' : '#555',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#222' : '#fff',
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Transactions') iconName = 'list-outline';
          else if (route.name === 'Settings') iconName = 'settings-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function CustomDrawerContent(props) {
  const { isDark } = useContext(ThemeContext);

  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: isDark ? '#111' : '#fff' }}>
      <View style={{ padding: 20, borderBottomWidth: 1, borderColor: isDark ? '#333' : '#ccc' }}>
        <Text style={{ fontSize: 24, color: isDark ? '#fff' : '#000', fontWeight: 'bold' }}>
          Nelson Chege
        </Text>
        <Text style={{ color: isDark ? '#bbb' : '#666', marginTop: 4 }}>nelson@email.com</Text>
      </View>
      <DrawerItem
        label="Home"
        icon={({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />}
        onPress={() => props.navigation.navigate('Home')}
        labelStyle={{ color: isDark ? '#fff' : '#000' }}
      />
      <DrawerItem
        label="Transactions"
        icon={({ color, size }) => <Ionicons name="list-outline" size={size} color={color} />}
        onPress={() => props.navigation.navigate('Transactions')}
        labelStyle={{ color: isDark ? '#fff' : '#000' }}
      />
      <DrawerItem
        label="Settings"
        icon={({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />}
        onPress={() => props.navigation.navigate('Settings')}
        labelStyle={{ color: isDark ? '#fff' : '#000' }}
      />
      <DrawerItem
        label="About"
        icon={({ color, size }) => <Ionicons name="information-circle-outline" size={size} color={color} />}
        onPress={() => props.navigation.navigate('About')}
        labelStyle={{ color: isDark ? '#fff' : '#000' }}
      />
    </DrawerContentScrollView>
  );
}

export default function App() {
  // Use system color scheme as default
  const colorScheme = useColorScheme();

  const [isDark, setIsDark] = useState(colorScheme === 'dark');

  useEffect(() => {
    setIsDark(colorScheme === 'dark');
  }, [colorScheme]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
        <Drawer.Navigator
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{
            headerShown: false,
            drawerStyle: {
              backgroundColor: isDark ? '#111' : '#fff',
              width: 240,
            },
            drawerActiveTintColor: '#4a90e2',
            drawerInactiveTintColor: isDark ? '#aaa' : '#555',
          }}
        >
          <Drawer.Screen name="Home" component={Tabs} />
          <Drawer.Screen name="About" component={AboutScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </ThemeContext.Provider>
  );
}

const baseStyles = {
  container: {
    flex: 1,
    padding: 20,
  },
  menuButton: {
    position: 'absolute',
    top: 42,
    left: 20,
    zIndex: 10,
    padding: 6,
    borderRadius: 30,
    // backgroundColor dynamically added below
  },
  greeting: {
    fontSize: 28,
    fontWeight: '600',
    marginTop: 60,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  balanceCard: {
    padding: 24,
    borderRadius: 12,
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 16,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    marginTop: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  summaryBox: {
    flex: 1,
    borderRadius: 12,
    padding: 18,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  summaryAmount: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 6,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: '#4a90e2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 30,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 10,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 18,
    marginTop: 60,
  },
  list: {
    flex: 1,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  transactionTitle: {
    fontSize: 18,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
  income: {
    color: '#28c76f',
  },
  expense: {
    color: '#ff5c5c',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 14,
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenText: {
    fontSize: 18,
    marginVertical: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
};

const lightStyles = StyleSheet.create({
  ...baseStyles,
  container: {
    ...baseStyles.container,
    backgroundColor: '#f7f7f7',
  },
  menuButton: {
    ...baseStyles.menuButton,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  greeting: {
    ...baseStyles.greeting,
    color: '#000',
  },
  subtitle: {
    ...baseStyles.subtitle,
    color: '#444',
  },
  balanceCard: {
    ...baseStyles.balanceCard,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  balanceLabel: {
    ...baseStyles.balanceLabel,
    color: '#666',
  },
  balanceAmount: {
    ...baseStyles.balanceAmount,
    color: '#111',
  },
  summaryTitle: {
    ...baseStyles.summaryTitle,
    color: '#444',
  },
  summaryAmount: {
    ...baseStyles.summaryAmount,
  },
  actions: {
    ...baseStyles.actions,
  },
  actionButton: {
    ...baseStyles.actionButton,
  },
  actionText: {
    ...baseStyles.actionText,
  },
  sectionTitle: {
    ...baseStyles.sectionTitle,
    color: '#000',
  },
  list: {
    ...baseStyles.list,
  },
  transactionItem: {
    ...baseStyles.transactionItem,
    borderColor: '#ddd',
  },
  transactionTitle: {
    ...baseStyles.transactionTitle,
    color: '#222',
  },
  transactionDate: {
    ...baseStyles.transactionDate,
  },
  transactionAmount: {
    ...baseStyles.transactionAmount,
  },
  income: {
    color: '#28c76f',
  },
  expense: {
    color: '#ff5c5c',
  },
  settingItem: {
    ...baseStyles.settingItem,
  },
  settingLabel: {
    ...baseStyles.settingLabel,
    color: '#222',
  },
  centered: {
    ...baseStyles.centered,
  },
  screenText: {
    ...baseStyles.screenText,
    color: '#444',
  },
  modalOverlay: {
    ...baseStyles.modalOverlay,
  },
  modalContent: {
    ...baseStyles.modalContent,
    backgroundColor: '#fff',
  },
  modalTitle: {
    ...baseStyles.modalTitle,
    color: '#222',
  },
  modalText: {
    ...baseStyles.modalText,
    color: '#444',
  },
  modalButton: {
    ...baseStyles.modalButton,
  },
  modalButtonText: {
    ...baseStyles.modalButtonText,
  },
});

const darkStyles = StyleSheet.create({
  ...baseStyles,
  container: {
    ...baseStyles.container,
    backgroundColor: '#121212',
  },
  menuButton: {
    ...baseStyles.menuButton,
    backgroundColor: '#222',
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  greeting: {
    ...baseStyles.greeting,
    color: '#fff',
  },
  subtitle: {
    ...baseStyles.subtitle,
    color: '#bbb',
  },
  balanceCard: {
    ...baseStyles.balanceCard,
    backgroundColor: '#1f1f1f',
  },
  balanceLabel: {
    ...baseStyles.balanceLabel,
    color: '#aaa',
  },
  balanceAmount: {
    ...baseStyles.balanceAmount,
    color: '#eee',
  },
  summaryTitle: {
    ...baseStyles.summaryTitle,
    color: '#bbb',
  },
  summaryAmount: {
    ...baseStyles.summaryAmount,
    color: '#eee',
  },
  actions: {
    ...baseStyles.actions,
  },
  actionButton: {
    ...baseStyles.actionButton,
    backgroundColor: '#4a90e2',
  },
  actionText: {
    ...baseStyles.actionText,
  },
  sectionTitle: {
    ...baseStyles.sectionTitle,
    color: '#fff',
  },
  list: {
    ...baseStyles.list,
  },
  transactionItem: {
    ...baseStyles.transactionItem,
    borderColor: '#333',
  },
  transactionTitle: {
    ...baseStyles.transactionTitle,
    color: '#eee',
  },
  transactionDate: {
    ...baseStyles.transactionDate,
    color: '#888',
  },
  transactionAmount: {
    ...baseStyles.transactionAmount,
  },
  income: {
    color: '#28c76f',
  },
  expense: {
    color: '#ff5c5c',
  },
  settingItem: {
    ...baseStyles.settingItem,
  },
  settingLabel: {
    ...baseStyles.settingLabel,
    color: '#eee',
  },
  centered: {
    ...baseStyles.centered,
  },
  screenText: {
    ...baseStyles.screenText,
    color: '#bbb',
  },
  modalOverlay: {
    ...baseStyles.modalOverlay,
  },
  modalContent: {
    ...baseStyles.modalContent,
    backgroundColor: '#222',
  },
  modalTitle: {
    ...baseStyles.modalTitle,
    color: '#fff',
  },
  modalText: {
    ...baseStyles.modalText,
    color: '#ddd',
  },
  modalButton: {
    ...baseStyles.modalButton,
    backgroundColor: '#4a90e2',
  },
  modalButtonText: {
    ...baseStyles.modalButtonText,
  },
});
