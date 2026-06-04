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
        referenceCode: null // Odd task (1st task) - No reference solution display
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
}` // Even task (2nd task) - Shows reference code
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
        referenceCode: null
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
}`
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
}`
      }
    ]
  }
];
