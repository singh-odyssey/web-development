# Theme Selector

A interactive theme switching application that allows users to dynamically change website appearance with four distinct theme options: Dark, Light, Midnight, and Gradient.

## ✨ Features

- **4 Theme Options**: Dark, Light, Midnight, and Gradient themes
- **Real-time Switching**: Instant theme application without page reload
- **Dynamic Styling**: JavaScript-powered CSS property manipulation
- **Responsive Design**: Works seamlessly across all device sizes
- **Custom Styling**: Unique visual identity for each theme
- **Interactive Buttons**: Hover effects and smooth transitions

## 🛠️ Technologies Used

- **HTML5**: Semantic structure with accessibility considerations
- **CSS3**: Custom styling and smooth transitions
- **JavaScript (ES6)**: DOM manipulation and event handling
- **Responsive Design**: Mobile-first approach

## 🎨 Available Themes

### 1. **Dark Theme**
- Background: Pure Black (`#000000`)
- Text: White
- Clean, minimalist dark mode experience

### 2. **Light Theme**
- Background: Pure White (`#ffffff`)
- Text: Black
- Classic light mode for optimal readability

### 3. **Midnight Theme**
- Background: Dark Blue-Gray (`#232b2b`)
- Text: White
- Sophisticated dark variant with subtle color depth

### 4. **Gradient Theme**
- Background: Linear gradient (`#de54a4` → `#794cc2` → `#632cba`)
- Text: White
- Vibrant purple-pink gradient for modern aesthetics

## 🚀 Functionality

- **Event-Driven**: Each button triggers specific theme changes
- **CSS Property Updates**: Dynamic modification of `backgroundColor`, `backgroundImage`, and `color`
- **State Management**: Smooth transitions between different visual states
- **User Experience**: Immediate visual feedback on theme selection

## 📁 Project Structure

```
themeSelect/
├── index.html          # Main interface with theme selector
├── style.css           # Base styling and button designs
└── script.js           # Theme switching logic
```

## 💻 Technical Implementation

```javascript
// Example theme switching logic
document.querySelector('#btn-1').addEventListener('click', () => {
    document.querySelector('body').style.backgroundColor = 'black';
    document.querySelector('body').style.color = 'white';
});
```

## 🎯 Key Features

- **Instant Application**: No page reload required for theme changes
- **Cross-Device Compatibility**: Responsive across all screen sizes
- **Clean Interface**: Minimalist design focusing on functionality
- **Smooth Transitions**: CSS transitions for enhanced user experience

## 🔧 Customization Options

- Easy to add new themes by extending the JavaScript logic
- Customizable color schemes and gradients
- Expandable to include more complex styling properties
- Potential for theme persistence using localStorage

## 💡 Perfect For

- Learning DOM manipulation with JavaScript
- Understanding CSS property modification
- Theme system implementation
- User preference settings
- Frontend development practice
- UI/UX design exploration

## 🎓 Educational Value

- **JavaScript Events**: Understanding event listeners and callbacks
- **DOM Manipulation**: Direct style property modification
- **CSS Properties**: Dynamic styling with JavaScript
- **User Interface Design**: Theme switching patterns

---

**Made with Love by Aditya Singh** ❤️ 