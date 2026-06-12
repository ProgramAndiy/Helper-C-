export const courseModules = [
  {
    id: 1,
    title: "Модуль 1: Основи програмування та синтаксису C#",
    description: "Базовий рівень: Вступ до .NET, Змінні, Оператори, Умовні конструкції, Цикли, Масиви, Методи.",
    status: 'completed',
    topics: [
      {
        id: "intro-dotnet",
        title: "1. Вступ до .NET та C#",
        content: `
          <h3>Платформа .NET та мова C#</h3>
          <p><strong>C#</strong> — це сучасна об'єктно-орієнтована мова програмування, створена компанією Microsoft. Вона є основною мовою для розробки на платформі <strong>.NET</strong>.</p>
          <p><strong>.NET</strong> — це безкоштовна кросплатформна екосистема для розробки додатків. Головні компоненти платформи:</p>
          <ul>
            <li><strong>CLR (Common Language Runtime)</strong> — віртуальна машина, яка виконує код C#. Вона керує пам'яттю (Garbage Collector), забезпечує безпеку типів та обробку виняткових ситуацій.</li>
            <li><strong>JIT (Just-In-Time) Compiler</strong> — компілятор всередині CLR, який перетворює проміжний код (IL - Intermediate Language) у машинний код безпосередньо перед його виконанням.</li>
            <li><strong>Base Class Library (BCL)</strong> — великий набір готових класів та API для роботи з файлами, мережею, колекціями тощо.</li>
          </ul>
          <div class="info-card">
            <strong>Важливо знати:</strong> Код на C# спочатку компілюється в IL-код (файл з розширенням .dll або .exe). JIT-компілятор перекладає його в машинний код на льоту вже на комп'ютері користувача.
          </div>
        `
      },
      {
        id: "variables-types",
        title: "2. Змінні та типи даних",
        content: `
          <h3>Типізація у C#</h3>
          <p>C# є мовою зі <strong>строгою статичною типізацією</strong>. Це означає, що кожна змінна має чітко визначений тип, який не може змінюватися в процесі виконання програми.</p>
          <p>Основні типи даних поділяються на:</p>
          <ul>
            <li><strong>Цілі числа:</strong> <code>int</code> (32-бітне), <code>long</code> (64-бітне), <code>short</code> (16-бітне), <code>byte</code> (8-бітне).</li>
            <li><strong>Числа з рухомою комою:</strong> <code>float</code> (точність ~6-9 цифр), <code>double</code> (точність ~15-17 цифр), <code>decimal</code> (надвисока точність, 128-бітне, ідеальне для фінансів).</li>
            <li><strong>Логічний тип:</strong> <code>bool</code> (приймає лише <code>true</code> або <code>false</code>).</li>
            <li><strong>Символьний тип:</strong> <code>char</code> (один символ в одинарних лапках, наприклад, <code>'A'</code>).</li>
            <li><strong>Рядки:</strong> <code>string</code> (послідовність символів у подвійних лапках, наприклад, <code>"Привіт"</code>).</li>
          </ul>
          <div class="info-card" style="border-left-color: var(--accent);">
            <strong>Стек проти Купи (Stack vs Heap):</strong> Змінні значимих типів (int, bool, double) зазвичай зберігаються у стеку (швидка тимчасова пам'ять). Змінні посилальних типів (класи, масиви) зберігають лише посилання у стеку, а самі дані створюються в купі (Heap).
          </div>
        `
      },
      {
        id: "loops-conditions",
        title: "3. Умовні конструкції та цикли",
        content: `
          <h3>Керування потоком виконання</h3>
          <p>Для розгалуження логіки використовують оператори <code>if</code>, <code>else if</code>, <code>else</code>, а також конструкцію <code>switch</code>.</p>
          <p>C# підтримує чотири типи циклів для повторення операцій:</p>
          <ol>
            <li><strong>for:</strong> використовується, коли заздалегідь відома точна кількість ітерацій.</li>
            <li><strong>while:</strong> виконується доти, доки логічна умова є істинною (перевірка на початку).</li>
            <li><strong>do while:</strong> виконується хоча б один раз, оскільки умова перевіряється наприкінці.</li>
            <li><strong>foreach:</strong> спеціальний цикл для перебору елементів колекцій або масивів без використання індексів.</li>
          </ol>
          <pre style="background: rgba(0,0,0,0.5); padding: 1rem; border-radius: 4px; color: #fff; font-family: monospace; margin: 1rem 0;">
int[] numbers = { 1, 2, 3 };
foreach (int num in numbers) {
    Console.WriteLine(num);
}</pre>
        `
      }
    ],
    quizzes: [
      { id: "q1_1", question: "Який тип даних використовується для збереження логічних значень true або false?", options: ["int", "string", "bool", "double"], correctAnswerIndex: 2 },
      { id: "q1_2", question: "Який цикл виконується хоча б один раз, навіть якщо початкова умова є хибною?", options: ["for", "while", "do while", "foreach"], correctAnswerIndex: 2 },
      { id: "q1_3", question: "Що виведе цей код на екран?", image: "https://placehold.co/500x120/1e1e1e/4cc9f0?text=int+x+%3D+5%3B%0AConsole.WriteLine(x+%2B+2)%3B", options: ["52", "7", "x+2", "Помилка компіляції"], correctAnswerIndex: 1 },
      { id: "q1_4", question: "Який компонент .NET перетворює IL-код у машинний код безпосередньо перед виконанням?", options: ["Garbage Collector", "CLR", "JIT Compiler", "BCL"], correctAnswerIndex: 2 },
      { id: "q1_5", question: "Скільки біт пам'яті займає тип int у C#?", options: ["8", "16", "32", "64"], correctAnswerIndex: 2 },
      { id: "q1_6", question: "Що виведе властивість Length для цього рядка?", image: "https://placehold.co/500x120/1e1e1e/4cc9f0?text=string+s+%3D+%22Hello%22%3B%0AConsole.WriteLine(s.Length)%3B", options: ["4", "5", "6", "Hello"], correctAnswerIndex: 1 },
      { id: "q1_7", question: "Який з наведених типів не є цілочисельним?", options: ["int", "byte", "long", "double"], correctAnswerIndex: 3 },
      { id: "q1_8", question: "Який оператор використовується для знаходження остачі від ділення?", options: ["/", "*", "%", "\\"], correctAnswerIndex: 2 }
    ],
    tasks: [
      {
        id: 1,
        title: "Завдання 1: Калькулятор площі прямокутника",
        description: "Створіть консольну програму, яка розраховує площу прямокутника за заданими параметрами.",
        instructions: [
          "Оголосіть змінну `double width` та присвойте їй значення `5.5`.",
          "Оголосіть змінну `double height` та присвойте їй значення `10.0`.",
          "Створіть змінну `double area` та порахуйте площу прямокутника.",
          "Виведіть результат у консоль у точному форматі: `Area: [значення]` (наприклад, `Area: 55`)."
        ],
        initialCode: `using System;

namespace HelperPlatform
{
    class Program
    {
        static void Main(string[] args)
        {
            // Напишіть ваш код тут:
            
        }
    }
}`,
        referenceCode: null,
        expectedOutput: "Area: 55"
      },
      {
        id: 2,
        title: "Завдання 2: Парність елементів масиву",
        description: "Створіть програму для перевірки парності кожного числа в масиві за допомогою циклу foreach.",
        instructions: [
          "Оголосіть масив цілих чисел `numbers` зі значеннями: `1, 2, 3, 4, 5`.",
          "За допомогою циклу \`foreach\` пройдіться по кожному числу в масиві.",
          "Для кожного числа виведіть у консоль повідомлення в форматі:",
          "  - Якщо число парне: \`[число] is Even\`",
          "  - Якщо число непарне: \`[число] is Odd\`"
        ],
        initialCode: `using System;

namespace HelperPlatform
{
    class Program
    {
        static void Main(string[] args)
        {
            // Напишіть ваш код тут (Масив: 1, 2, 3, 4, 5):
            
        }
    }
}`,
        referenceCode: `using System;

namespace HelperPlatform
{
    class Program
    {
        static void Main(string[] args)
        {
            int[] numbers = { 1, 2, 3, 4, 5 };
            
            foreach (int num in numbers)
            {
                if (num % 2 == 0)
                {
                    Console.WriteLine(num + " is Even");
                }
                else
                {
                    Console.WriteLine(num + " is Odd");
                }
            }
        }
    }
}`,
        expectedOutput: "1 is Odd"
      }
    ]
  },
  {
    id: 2,
    title: "Модуль 2: Об'єктно-орієнтоване програмування (ООП)",
    description: "Фундамент: Класи та об'єкти, Інкапсуляція, Успадкування, Поліморфізм, Абстракція, Інтерфейси.",
    status: 'in-progress',
    topics: [
      {
        id: "classes-objects",
        title: "1. Класи та об'єкти",
        content: `
          <h3>Основи класів в C#</h3>
          <p><strong>Клас</strong> — це шаблон або креслення, за яким створюються об'єкти. Він описує стан (поля, властивості) та поведінку (методи) майбутнього об'єкта.</p>
          <p><strong>Об'єкт</strong> — це конкретний екземпляр класу, який займає місце в купі пам'яті.</p>
          <p>Створення класу та об'єкта виглядає так:</p>
          <pre style="background: rgba(0,0,0,0.5); padding: 1rem; border-radius: 4px; color: #fff; font-family: monospace; margin: 1rem 0;">
class Person {
    public string Name { get; set; } // Властивість
    
    public void Introduce() { // Метод
        Console.WriteLine("Привіт, я " + Name);
    }
}

// Створення об'єкта:
Person person = new Person();
person.Name = "Олексій";
person.Introduce();</pre>
        `
      },
      {
        id: "oop-principles",
        title: "2. Три стовпи ООП",
        content: `
          <h3>Інкапсуляція, Успадкування, Поліморфізм</h3>
          <ul>
            <li><strong>Інкапсуляція</strong> — приховування внутрішніх деталей реалізації об'єкта та надання контрольованого доступу через публічні методи чи властивості (модифікатори <code>private</code>, <code>public</code>, <code>protected</code>).</li>
            <li><strong>Успадкування</strong> — механізм, який дозволяє одному класу переймати поля та поведінку іншого класу (записується як <code>class Dog : Animal</code>).</li>
            <li><strong>Поліморфізм</strong> — можливість об'єктів різних класів по-різному реагувати на один і той самий метод. Реалізується через перевизначення віртуальних методів (<code>virtual</code> у базовому класі та <code>override</code> у похідному).</li>
          </ul>
        `
      }
    ],
    quizzes: [
      { id: "q2_1", question: "Який принцип ООП полягає у приховуванні деталей реалізації та обмеженні прямого доступу до даних?", options: ["Успадкування", "Поліморфізм", "Інкапсуляція", "Абстракція"], correctAnswerIndex: 2 },
      { id: "q2_2", question: "Який оператор використовується у C# для успадкування класу?", image: "https://placehold.co/500x120/1e1e1e/4cc9f0?text=class+Dog+%5B%3F%5D+Animal+%7B+%7D", options: ["extends", ":", "implements", "base"], correctAnswerIndex: 1 },
      { id: "q2_3", question: "Що таке конструктор класу?", options: ["Метод, який видаляє об'єкт", "Метод, який викликається при створенні об'єкта", "Змінна класу", "Модифікатор доступу"], correctAnswerIndex: 1 },
      { id: "q2_4", question: "Яке ключове слово дозволяє перевизначити метод у похідному класі?", image: "https://placehold.co/500x120/1e1e1e/4cc9f0?text=public+%5B%3F%5D+void+MakeSound()%0A%7B+Console.WriteLine(%22Bark%22)%3B+%7D", options: ["virtual", "new", "override", "abstract"], correctAnswerIndex: 2 },
      { id: "q2_5", question: "Що таке 'this' у C#?", options: ["Посилання на поточний екземпляр класу", "Ключове слово для створення циклу", "Посилання на базовий клас", "Статична змінна"], correctAnswerIndex: 0 },
      { id: "q2_6", question: "Чи підтримує C# множинне успадкування класів?", options: ["Так, без обмежень", "Ні, клас може успадковувати лише один інший клас", "Так, але лише абстрактних класів", "Ні, успадкування взагалі заборонено"], correctAnswerIndex: 1 },
      { id: "q2_7", question: "Який модифікатор доступу робить члена класу доступним лише всередині цього ж класу?", options: ["public", "protected", "internal", "private"], correctAnswerIndex: 3 },
      { id: "q2_8", question: "Що робить ключове слово 'base'?", options: ["Створює новий об'єкт", "Дозволяє звернутися до членів базового класу", "Знищує об'єкт", "Перевизначає метод"], correctAnswerIndex: 1 }
    ],
    tasks: [
      {
        id: 1,
        title: "Завдання 1: Клас Автомобіль та конструктор",
        description: "Реалізуйте простий клас Автомобіль зі спеціальними властивостями.",
        instructions: [
          "Створіть клас `Car` з двома автоматичними властивостями: `string Brand` та `int Year`.",
          "Створіть метод `void Drive()`, який виводить у консоль: `[Brand] is driving!`.",
          "В методі `Main` створіть об'єкт класу `Car`, задайте будь-які параметри та викличте метод `Drive()`."
        ],
        initialCode: `using System;

namespace HelperPlatform
{
    class Program
    {
        static void Main(string[] args)
        {
            // Створіть екземпляр Car та викличте Drive:
            
        }
    }

    // Оголосіть клас Car тут:
    
}`,
        referenceCode: null,
        expectedOutput: "is driving!"
      },
      {
        id: 2,
        title: "Завдання 2: Поліморфізм та перевизначення",
        description: "Реалізуйте перевизначення віртуального методу для демонстрації поліморфізму.",
        instructions: [
          "Створіть клас `Animal` з віртуальним методом `public virtual void MakeSound()`.",
          "У методі `MakeSound` класу `Animal` виведіть: `Some generic sound`.",
          "Створіть клас `Dog`, який успадковує `Animal`.",
          "Перевизначте (`override`) метод `MakeSound` у класі `Dog` та виведіть: `Bark`.",
          "У методі `Main` створіть змінну типу `Animal`, ініціалізуйте її об'єктом `Dog` і викличте `MakeSound()`."
        ],
        initialCode: `using System;

namespace HelperPlatform
{
    class Program
    {
        static void Main(string[] args)
        {
            // Створіть Animal myDog = new Dog() та викличте MakeSound:
            
        }
    }

    // Клас Animal:
    
    // Клас Dog:
    
}`,
        referenceCode: `using System;

namespace HelperPlatform
{
    class Program
    {
        static void Main(string[] args)
        {
            Animal myDog = new Dog();
            myDog.MakeSound(); // Виведе "Bark" завдяки поліморфізму
        }
    }

    class Animal
    {
        public virtual void MakeSound()
        {
            Console.WriteLine("Some generic sound");
        }
    }

    class Dog : Animal
    {
        public override void MakeSound()
        {
            Console.WriteLine("Bark");
        }
    }
}`,
        expectedOutput: "Bark"
      }
    ]
  },
  {
    id: 3,
    title: "Модуль 3: Робота з пам'яттю та механізми мови",
    description: "Під капотом: Стек vs Купа, Value/Reference типи, Garbage Collector, IDisposable, Обробка винятків.",
    status: 'locked',
    topics: [
      {
        id: "value-reference",
        title: "1. Класи (Reference) та Структури (Value)",
        content: `
          <h3>Основна відмінність</h3>
          <p>В C# всі типи даних поділяються на Значимі та Посилальні. Ключова різниця полягає в копіюванні:</p>
          <ul>
            <li><strong>Структури (struct):</strong> Значимі типи. Копіюють самі дані. Зміна копії структури не змінює оригінал.</li>
            <li><strong>Класи (class):</strong> Посилальні типи. Копіюють лише посилання на купу. Зміна об'єкта через копію посилання змінить дані і в оригіналі, бо посилання вказують на одну адресу.</li>
          </ul>
        `
      }
    ],
    quizzes: [
      { id: "q3_1", question: "Де зазвичай зберігаються змінні значимих типів (Value Types) у C#?", options: ["У стеку (Stack)", "У купі (Heap)", "У файлі конфігурації", "У статичній пам'яті"], correctAnswerIndex: 0 },
      { id: "q3_2", question: "Що таке Garbage Collector (Збирач сміття) у .NET?", options: ["Утиліта для очищення жорсткого диска", "Автоматична система керування пам'яттю", "Інструмент для видалення старого коду", "Комп'ютерний вірус"], correctAnswerIndex: 1 },
      { id: "q3_3", question: "Який тип є посилальним (Reference Type)?", options: ["int", "struct", "class", "bool"], correctAnswerIndex: 2 },
      { id: "q3_4", question: "Що буде виведено?", image: "https://placehold.co/500x160/1e1e1e/4cc9f0?text=int+a+%3D+10%3B%0Aint+b+%3D+a%3B%0Ab+%3D+20%3B%0AConsole.WriteLine(a)%3B", options: ["10", "20", "0", "Помилка"], correctAnswerIndex: 0 },
      { id: "q3_5", question: "Для чого використовується інтерфейс IDisposable?", options: ["Для ручного звільнення некерованих ресурсів", "Для створення масивів", "Для підключення до БД", "Для обробки винятків"], correctAnswerIndex: 0 },
      { id: "q3_6", question: "Яка конструкція використовується разом з IDisposable для автоматичного виклику Dispose()?", options: ["try-catch", "using", "lock", "fixed"], correctAnswerIndex: 1 },
      { id: "q3_7", question: "Що відбувається при присвоєнні одного об'єкта класу іншому?", image: "https://placehold.co/500x120/1e1e1e/4cc9f0?text=Car+c1+%3D+new+Car()%3B%0ACar+c2+%3D+c1%3B", options: ["Копіюються всі дані об'єкта", "Створюється новий об'єкт", "Копіюється посилання на той самий об'єкт у купі", "Виникає помилка"], correctAnswerIndex: 2 },
      { id: "q3_8", question: "Яке ключове слово використовується для упаковки (boxing) значимого типу?", options: ["Немає ключового слова, це відбувається неявно", "box", "pack", "wrap"], correctAnswerIndex: 0 }
    ],
    tasks: [
      {
        id: 1,
        title: "Завдання 1: Зміна властивостей структури",
        description: "Перевірте поведінку структур при передачі копії значення.",
        instructions: [
          "Створіть `struct Point` з полем `public int X`.",
          "Створіть метод `static void Modify(Point p)`, який задає `p.X = 10`.",
          "Передайте змінну в цей метод та виведіть значення `X` у консоль після виклику методу (воно має залишитись незмінним)."
        ],
        initialCode: `using System;

namespace HelperPlatform
{
    class Program
    {
        static void Main(string[] args)
        {
            
        }
    }
}`,
        referenceCode: null
      },
      {
        id: 2,
        title: "Завдання 2: Зміна властивостей класу",
        description: "Перевірте поведінку класів при роботі з посиланнями на пам'ять.",
        instructions: [
          "Створіть `class PointClass` з полем `public int X`.",
          "Створіть метод `static void Modify(PointClass p)`, який встановлює `p.X = 99`.",
          "Передайте екземпляр класу в метод та виведіть значення `X` після виклику (воно зміниться на 99)."
        ],
        initialCode: `using System;

namespace HelperPlatform
{
    class Program
    {
        static void Main(string[] args)
        {
            
        }
    }
}`,
        referenceCode: `using System;

namespace HelperPlatform
{
    class PointClass
    {
        public int X;
    }

    class Program
    {
        static void Modify(PointClass p)
        {
            p.X = 99;
        }

        static void Main(string[] args)
        {
            PointClass point = new PointClass();
            point.X = 10;
            Modify(point);
            Console.WriteLine(point.X); // Виведе 99
        }
    }
}`,
        expectedOutput: "99"
      }
    ]
  },
  {
    id: 4,
    title: "Модуль 4: Колекції та LINQ",
    description: "Опануйте роботу з даними: List, Dictionary, IEnumerable, LINQ-запити та лямбда-вирази.",
    status: 'locked',
    topics: [
      {
        id: "collections-intro",
        title: "1. Колекції в C#",
        content: `
          <h3>Основи колекцій</h3>
          <p>Колекції — це спеціальні класи для зберігання та управління групами об'єктів. Вони гнучкіші за звичайні масиви, оскільки можуть динамічно змінювати свій розмір.</p>
          <ul>
            <li><strong>List&lt;T&gt;</strong> — динамічний масив. Найпопулярніша колекція для зберігання списку елементів.</li>
            <li><strong>Dictionary&lt;TKey, TValue&gt;</strong> — словник, який зберігає дані у вигляді пар "ключ-значення". Дуже швидкий пошук за ключем.</li>
            <li><strong>Queue&lt;T&gt;</strong> — черга, працює за принципом FIFO (First In, First Out).</li>
            <li><strong>Stack&lt;T&gt;</strong> — стек, працює за принципом LIFO (Last In, First Out).</li>
          </ul>
        `
      }
    ],
    quizzes: [
      { id: "q4_1", question: "Яка колекція зберігає дані у вигляді пар 'ключ-значення'?", options: ["List<T>", "Dictionary<TKey, TValue>", "Queue<T>", "Stack<T>"], correctAnswerIndex: 1 },
      { id: "q4_2", question: "Що таке LINQ?", options: ["Language-Integrated Query", "Local Integration Network Queue", "Лінійна структура даних", "Бібліотека для графіки"], correctAnswerIndex: 0 },
      { id: "q4_3", question: "Що робить метод Where() у LINQ?", image: "https://placehold.co/500x120/1e1e1e/4cc9f0?text=var+res+%3D+nums.Where(x+%3D%3E+x+%3E+0)%3B", options: ["Сортує елементи", "Повертає перший елемент", "Фільтрує колекцію за умовою", "Видаляє елементи"], correctAnswerIndex: 2 },
      { id: "q4_4", question: "Який метод використовується для сортування за зростанням у LINQ?", options: ["SortBy()", "OrderBy()", "Order()", "Arrange()"], correctAnswerIndex: 1 },
      { id: "q4_5", question: "Що з цього є лямбда-виразом?", options: ["x => x * 2", "function(x) { return x * 2 }", "def x: x * 2", "x -> x * 2"], correctAnswerIndex: 0 },
      { id: "q4_6", question: "Яка колекція працює за принципом LIFO (Last In, First Out)?", options: ["Queue", "Stack", "List", "Dictionary"], correctAnswerIndex: 1 },
      { id: "q4_7", question: "Який інтерфейс є базовим для всіх колекцій LINQ?", options: ["ICollection", "IList", "IEnumerable", "IDictionary"], correctAnswerIndex: 2 },
      { id: "q4_8", question: "Як отримати кількість елементів у списку List<int>?", options: ["list.Length", "list.Size()", "list.Count", "list.Items"], correctAnswerIndex: 2 }
    ],
    tasks: []
  },
  {
    id: 5,
    title: "Модуль 5: Асинхронне програмування",
    description: "Вивчіть Task, async/await, паралельне виконання та потоки для створення швидких додатків.",
    status: 'locked',
    topics: [
      {
        id: "async-await-intro",
        title: "1. Основи async / await",
        content: `
          <h3>Асинхронність у C#</h3>
          <p>Асинхронне програмування дозволяє виконувати довготривалі операції (наприклад, завантаження файлів з інтернету) без блокування основного потоку виконання.</p>
          <p>Основні ключові слова: <code>async</code> та <code>await</code>. Метод, позначений як <code>async</code>, може використовувати <code>await</code> для очікування результату виконання іншого асинхронного завдання (Task).</p>
        `
      }
    ],
    quizzes: [
      { id: "q5_1", question: "Які ключові слова використовуються для асинхронних методів у C#?", options: ["yield / return", "async / await", "thread / lock", "wait / pulse"], correctAnswerIndex: 1 },
      { id: "q5_2", question: "Що повертає асинхронний метод, який не має конкретного значення повернення?", options: ["void", "Task", "null", "Thread"], correctAnswerIndex: 1 },
      { id: "q5_3", question: "Який метод використовується для запуску затримки в асинхронному коді?", image: "https://placehold.co/500x120/1e1e1e/4cc9f0?text=await+%5B%3F%5D.Delay(1000)%3B", options: ["Thread.Sleep", "Task.Delay", "Timer.Wait", "Process.Suspend"], correctAnswerIndex: 1 },
      { id: "q5_4", question: "Що станеться, якщо викликати Thread.Sleep у головному (UI) потоці?", options: ["Потік призупиниться, але UI буде працювати", "Додаток повністю зависне (UI freeze)", "Код виконається асинхронно", "Виникне виняток компіляції"], correctAnswerIndex: 1 },
      { id: "q5_5", question: "Як дочекатися виконання одразу кількох асинхронних завдань?", options: ["Task.WaitAll()", "Task.WhenAll()", "await Task.All()", "Task.Group()"], correctAnswerIndex: 1 },
      { id: "q5_6", question: "Що таке Deadlock (взаємне блокування)?", options: ["Помилка підключення до БД", "Ситуація, коли два потоки нескінченно чекають один одного", "Коли пам'ять повністю заповнена", "Коли метод повертає null"], correctAnswerIndex: 1 },
      { id: "q5_7", question: "Яке ключове слово захищає блок коду від одночасного доступу кількох потоків?", options: ["secure", "lock", "protect", "safe"], correctAnswerIndex: 1 },
      { id: "q5_8", question: "Чи можна використовувати 'await' всередині 'lock'?", options: ["Так, без проблем", "Ні, це призведе до помилки компіляції", "Так, але лише у статичних методах", "Так, якщо lock містить try-catch"], correctAnswerIndex: 1 }
    ],
    tasks: []
  }
];
