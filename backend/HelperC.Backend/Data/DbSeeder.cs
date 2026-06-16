using System;
using System.Collections.Generic;
using System.Linq;
using HelperC.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace HelperC.Backend.Data
{
    public static class DbSeeder
    {
        public static void Seed(HelperCDbContext context)
        {
            // Apply migrations automatically
            context.Database.Migrate();

            // 1. Seed Teacher
            if (!context.Users.Any(u => u.Role == "teacher"))
            {
                var teacher = new User
                {
                    Id = Guid.NewGuid(),
                    Email = "teacher@helperc.ua",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("teacher123"),
                    FirstName = "Викладач",
                    LastName = "HelperC",
                    Role = "teacher",
                    CreatedAt = DateTime.UtcNow
                };
                context.Users.Add(teacher);
            }

            // 2. Seed Modules, Topics, Quizzes, Tasks
            // Clear existing modules to re-seed with new modules if needed, or check if we have fewer modules than expected.
            // Since we added modules 6-9, let's clear the database tables first if they exist and re-seed to ensure all 9 modules are created correctly.
            // Note: Since this is development, dropping/re-creating or clearing tables is safe.
            bool needsReseed = context.Modules.Count() < 9 ||
                               context.Topics.Any(t => t.Content.Contains("<h3>") || t.Content.Contains("<p>"));
            if (needsReseed)
            {
                // Clear tables to prevent foreign key errors and ensure clean seed
                context.QuizAttempts.ExecuteDelete();
                context.Tasks.ExecuteDelete();
                context.Quizzes.ExecuteDelete();
                context.Topics.ExecuteDelete();
                context.Modules.ExecuteDelete();

                var modules = new List<Module>
                {
                    // MODULE 1
                    new Module
                    {
                        Id = 1,
                        Title = "Модуль 1: Основи програмування та синтаксису C#",
                        Description = "Базовий рівень: Вступ до .NET, Змінні, Оператори, Умовні конструкції, Цикли, Масиви, Методи.",
                        Order = 1,
                        Topics = new List<Topic>
                        {
                            new Topic
                            {
                                Id = "intro-dotnet",
                                Title = "1. Вступ до .NET та C#",
                                Content = @"### Платформа .NET та мова C#

**C#** — це сучасна об'єктно-орієнтована мова програмування, створена компанією Microsoft. Вона є основною мовою для розробки на платформі **.NET**.

**.NET** — це безкоштовна кросплатформна екосистема для розробки додатків. Головні компоненти платформи:

* **CLR (Common Language Runtime)** — віртуальна машина, яка виконує код C#. Вона керує пам'яттю (Garbage Collector), забезпечує безпеку типів та обробку виняткових ситуацій.
* **JIT (Just-In-Time) Compiler** — компілятор всередині CLR, який перетворює проміжний код (IL - Intermediate Language) у машинний код безпосередньо перед його виконанням.
* **Base Class Library (BCL)** — великий набір готових класів та API для роботи з файлами, мережею, колекціями тощо.

> **Важливо знати:** Код на C# спочатку компілюється в IL-код (файл з розширенням .dll або .exe). JIT-компілятор перекладає його в машинний код на льоту вже на комп'ютері користувача."
                            },
                            new Topic
                            {
                                Id = "variables-types",
                                Title = "2. Змінні та типи даних",
                                Content = @"### Типізація у C#

C# є мовою зі **строгою статичною типізацією**. Це означає, що кожна змінна має чітко визначений тип, який не може змінюватися в процесі виконання програми.

Основні типи даних поділяються на:

* **Цілі числа:** `int` (32-бітне), `long` (64-бітне), `short` (16-бітне), `byte` (8-бітне).
* **Числа з рухомою комою:** `double` (точність ~15-17 цифр), `float`, `decimal` (надвисока точність, 128-бітне, ідеальне для фінансів).
* **Логічний тип:** `bool` (приймає лише `true` або `false`).
* **Символьний тип:** `char` (один символ в одинарних лапках, наприклад, `'A'`).
* **Рядки:** `string` (послідовність символів у подвійних лапках, наприклад, ""Привіт"").

> **Стек проти Купи (Stack vs Heap):** Змінні значимих типів (int, bool, double) зазвичай зберігаються у стеку (швидка тимчасова пам'ять). Змінні посилальних типів (класи, масиви) зберігають лише посилання у стеку, а самі дані створюються в купі (Heap)."
                            },
                            new Topic
                            {
                                Id = "loops-conditions",
                                Title = "3. Умовні конструкції та цикли",
                                Content = @"### Керування потоком виконання

Для розгалуження логіки використовують оператори `if`, `else if`, `else`, а також конструкцію `switch`.

C# підтримує чотири типи циклів для повторення операцій:

1. **for:** використовується, коли заздалегідь відома точна кількість ітерацій.
2. **while:** виконується доти, доки логічна умова є істинною (перевірка на початку).
3. **do while:** виконується хоча б один раз, оскільки умова перевіряється наприкінці.
4. **foreach:** спеціальний цикл для перебору елементів колекцій або масивів без використання індексів.

```csharp
int[] numbers = { 1, 2, 3 };
foreach (int num in numbers) {
    Console.WriteLine(num);
}
```"
                            }
                        },
                        Quizzes = new List<Quiz>
                        {
                            new Quiz { Id = "q1_1", Question = "Який тип даних використовується для збереження логічних значень true або false?", Options = new List<string> { "int", "string", "bool", "double" }, CorrectAnswerIndex = 2 },
                            new Quiz { Id = "q1_2", Question = "Який цикл виконується хося б один раз, навіть якщо початкова умова є хибною?", Options = new List<string> { "for", "while", "do while", "foreach" }, CorrectAnswerIndex = 2 },
                            new Quiz { Id = "q1_3", Question = "Що виведе цей код на екран?", Image = "https://placehold.co/500x120/1e1e1e/4cc9f0?text=int+x+%3D+5%3B%0AConsole.WriteLine(x+%2B+2)%3B", Options = new List<string> { "52", "7", "x+2", "Помилка компіляції" }, CorrectAnswerIndex = 1 },
                            new Quiz { Id = "q1_4", Question = "Який компонент .NET перетворює IL-код у машинний код безпосередньо перед виконанням?", Options = new List<string> { "Garbage Collector", "CLR", "JIT Compiler", "BCL" }, CorrectAnswerIndex = 2 },
                            new Quiz { Id = "q1_5", Question = "Скільки біт пам'яті займає тип int у C#?", Options = new List<string> { "8", "16", "32", "64" }, CorrectAnswerIndex = 2 },
                            new Quiz { Id = "q1_6", Question = "Що виведе властивість Length для цього рядка?", Image = "https://placehold.co/500x120/1e1e1e/4cc9f0?text=string+s+%3D+%22Hello%22%3B%0AConsole.WriteLine(s.Length)%3B", Options = new List<string> { "4", "5", "6", "Hello" }, CorrectAnswerIndex = 1 },
                            new Quiz { Id = "q1_7", Question = "Який з наведених типів не є цілочисельним?", Options = new List<string> { "int", "byte", "long", "double" }, CorrectAnswerIndex = 3 },
                            new Quiz { Id = "q1_8", Question = "Який оператор використовується для знаходження остачі від ділення?", Options = new List<string> { "/", "*", "%", "\\" }, CorrectAnswerIndex = 2 }
                        },
                        Tasks = new List<CourseTask>
                        {
                            new CourseTask
                            {
                                Id = 1,
                                Title = "Завдання 1: Калькулятор площі прямокутника",
                                Description = "Створіть консольну програму, яка розраховує площу прямокутника за заданими параметрами.",
                                Instructions = new List<string>
                                {
                                    "Оголосіть змінну `double width` та присвойте їй значення `5.5`.",
                                    "Оголосіть змінну `double height` та присвойте їй значення `10.0`.",
                                    "Створіть змінну `double area` та порахуйте площу прямокутника.",
                                    "Виведіть результат у консоль у точному форматі: `Area: [значення]` (наприклад, `Area: 55`)."
                                },
                                InitialCode = "using System;\n\nnamespace HelperPlatform\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            // Напишіть ваш код тут:\n            \n        }\n    }\n}",
                                ReferenceCode = null
                            },
                            new CourseTask
                            {
                                Id = 2,
                                Title = "Завдання 2: Парність елементів масиву",
                                Description = "Створіть програму для перевірки парності кожного числа в масиві за допомогою циклу foreach.",
                                Instructions = new List<string>
                                {
                                    "Оголосіть масив цілих чисел `numbers` зі значеннями: `1, 2, 3, 4, 5`.",
                                    "За допомогою циклу `foreach` пройдіться по кожному числу в масиві.",
                                    "Для кожного числа виведіть у консоль повідомлення в форматі:",
                                    "  - Якщо число парне: `[число] is Even`",
                                    "  - Якщо число непарне: `[число] is Odd`"
                                },
                                InitialCode = "using System;\n\nnamespace HelperPlatform\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            // Напишіть ваш код тут (Масив: 1, 2, 3, 4, 5):\n            \n        }\n    }\n}",
                                ReferenceCode = "using System;\n\nnamespace HelperPlatform\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            int[] numbers = { 1, 2, 3, 4, 5 };\n            \n            foreach (int num in numbers)\n            {\n                if (num % 2 == 0)\n                {\n                    Console.WriteLine(num + \" is Even\");\n                }\n                else\n                {\n                    Console.WriteLine(num + \" is Odd\");\n                }\n            }\n        }\n    }\n}"
                            }
                        }
                    },

                    // MODULE 2
                    new Module
                    {
                        Id = 2,
                        Title = "Модуль 2: Об'єктно-орієнтоване програмування (ООП)",
                        Description = "Фундамент: Класи та об'єкти, Інкапсуляція, Успадкування, Поліморфізм, Абстракція, Інтерфейси.",
                        Order = 2,
                        Topics = new List<Topic>
                        {
                            new Topic
                            {
                                Id = "classes-objects",
                                Title = "1. Класи та об'єкти",
                                Content = @"### Основи класів в C#

**Клас** — це шаблон або креслення, за яким створюються об'єкти. Він описує стан (поля, властивості) та поведінку (методи) майбутнього об'єкта.

**Об'єкт** — це конкретний екземпляр класу, який займає місце в купі пам'яті.

Створення класу та об'єкта виглядає так:

```csharp
class Person {
    public string Name { get; set; } // Властивість
    
    public void Introduce() { // Метод
        Console.WriteLine(""Привіт, я "" + Name);
    }
}

// Створення об'єкта:
Person person = new Person();
person.Name = ""Олексій"";
person.Introduce();
```"
                            },
                            new Topic
                            {
                                Id = "oop-principles",
                                Title = "2. Три стовпи ООП",
                                Content = @"### Інкапсуляція, Успадкування, Поліморфізм

* **Інкапсуляція** — приховування внутрішніх деталей реалізації об'єкта та надання контрольованого доступу через публічні методи чи властивості (модифікатори `private`, `public`, `protected`).
* **Успадкування** — механізм, який дозволяє одному класу переймати поля та поведінку іншого класу (записується як `class Dog : Animal`).
* **Поліморфізм** — можливість об'єктів різних класів по-різному реагувати на один і той самий метод. Реалізується через перевизначення віртуальних методів (`virtual` у базовому класі та `override` у похідному)."
                            }
                        },
                        Quizzes = new List<Quiz>
                        {
                            new Quiz { Id = "q2_1", Question = "Який принцип ООП полягає у приховуванні деталей реалізації та обмеженні прямого доступу до даних?", Options = new List<string> { "Успадкування", "Поліморфізм", "Інкапсуляція", "Абстракція" }, CorrectAnswerIndex = 2 },
                            new Quiz { Id = "q2_2", Question = "Який оператор використовується у C# для успадкування класу?", Image = "https://placehold.co/500x120/1e1e1e/4cc9f0?text=class+Dog+%5B%3F%5D+Animal+%7B+%7D", Options = new List<string> { "extends", ":", "implements", "base" }, CorrectAnswerIndex = 1 },
                            new Quiz { Id = "q2_3", Question = "Що таке конструктор класу?", Options = new List<string> { "Метод, який видаляє об'єкт", "Метод, який викликається при створенні об'єкта", "Змінна класу", "Модифікатор доступу" }, CorrectAnswerIndex = 1 },
                            new Quiz { Id = "q2_4", Question = "Яке ключове слово дозволяє перевизначити метод у похідному класі?", Image = "https://placehold.co/500x120/1e1e1e/4cc9f0?text=public+%5B%3F%5D+void+MakeSound()%0A%7B+Console.WriteLine(%22Bark%22)%3B+%7D", Options = new List<string> { "virtual", "new", "override", "abstract" }, CorrectAnswerIndex = 2 },
                            new Quiz { Id = "q2_5", Question = "Що таке 'this' у C#?", Options = new List<string> { "Посилання на поточний екземпляр класу", "Ключове слово для створення циклу", "Посилання на базовий клас", "Статична змінна" }, CorrectAnswerIndex = 0 },
                            new Quiz { Id = "q2_6", Question = "Чи підтримує C# множинне успадкування класів?", Options = new List<string> { "Так, без обмежень", "Ні, клас може успадковувати лише один інший клас", "Так, але лише абстрактних класів", "Ні, успадкування взагалі заборонено" }, CorrectAnswerIndex = 1 },
                            new Quiz { Id = "q2_7", Question = "Який модифікатор доступу робить члена класу доступним лише всередині цього ж класу?", Options = new List<string> { "public", "protected", "internal", "private" }, CorrectAnswerIndex = 3 },
                            new Quiz { Id = "q2_8", Question = "Що робить ключове слово 'base'?", Options = new List<string> { "Створює новий об'єкт", "Дозволяє звернутися до членів базового класу", "Знищує об'єкт", "Перевизначає метод" }, CorrectAnswerIndex = 1 }
                        },
                        Tasks = new List<CourseTask>
                        {
                            new CourseTask
                            {
                                Id = 3,
                                Title = "Завдання 1: Клас Автомобіль та конструктор",
                                Description = "Реалізуйте простий клас Автомобіль зі спеціальними властивостями.",
                                Instructions = new List<string>
                                {
                                    "Створіть клас `Car` з двома властивостями: `string Brand` та `int Year`.",
                                    "Створіть метод `void Drive()`, який виводить у консоль: `[Brand] is driving!`.",
                                    "В методі `Main` створить об'єкт класу `Car`, задайте будь-які параметри та викличте метод `Drive()`."
                                },
                                InitialCode = "using System;\n\nnamespace HelperPlatform\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            // Створіть екземпляр Car та викличте Drive:\n            \n        }\n    }\n\n    // Оголосіть клас Car тут:\n    \n}",
                                ReferenceCode = null
                            },
                            new CourseTask
                            {
                                Id = 4,
                                Title = "Завдання 2: Поліморфізм та перевизначення",
                                Description = "Реалізуйте перевизначення віртуального методу для демонстрації поліморфізму.",
                                Instructions = new List<string>
                                {
                                    "Створіть клас `Animal` з віртуальним методом `public virtual void MakeSound()`.",
                                    "У методі `MakeSound` класу `Animal` виведіть: `Some generic sound`.",
                                    "Створіть клас `Dog`, який успадковує `Animal`.",
                                    "Перевизначте (`override`) метод `MakeSound` у класі `Dog` та виведіть: `Bark`.",
                                    "У методі `Main` створить змінну типу `Animal`, ініціалізуйте її об'єктом `Dog` і викличте `MakeSound()`."
                                },
                                InitialCode = "using System;\n\nnamespace HelperPlatform\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            // Створіть Animal myDog = new Dog() та викличте MakeSound:\n            \n        }\n    }\n\n    // Клас Animal:\n    \n    // Клас Dog:\n    \n}",
                                ReferenceCode = "using System;\n\nnamespace HelperPlatform\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            Animal myDog = new Dog();\n            myDog.MakeSound(); // Виведе \"Bark\" завдяки поліморфізму\n        }\n    }\n\n    class Animal\n    {\n        public virtual void MakeSound()\n        {\n            Console.WriteLine(\"Some generic sound\");\n        }\n    }\n\n    class Dog : Animal\n    {\n        public override void MakeSound()\n        {\n            Console.WriteLine(\"Bark\");\n        }\n    }\n}"
                            }
                        }
                    },

                    // MODULE 3
                    new Module
                    {
                        Id = 3,
                        Title = "Модуль 3: Робота з пам'яттю та механізми мови",
                        Description = "Під капотом: Стек vs Купа, Value/Reference типи, Garbage Collector, IDisposable, Обробка винятків.",
                        Order = 3,
                        Topics = new List<Topic>
                        {
                            new Topic
                            {
                                Id = "value-reference",
                                Title = "1. Класи (Reference) та Структури (Value)",
                                Content = @"### Основна відмінність

В C# всі типи даних поділяються на Значимі та Посилальні. Ключова різниця полягає в копіюванні:

* **Структури (struct):** Значимі типи. Копіюють самі дані. Зміна копії структури не змінює оригінал.
* **Класи (class):** Посилальні типи. Копіюють лише посилання на купу. Зміна об'єкта через копію посилання змінить дані і в оригіналі, бо посилання вказують на одну адресу."
                            },
                            new Topic
                            {
                                Id = "stack-heap-gc",
                                Title = "2. Стек, Купа та Збирач сміття (Garbage Collector)",
                                Content = @"### Керування пам'яттю в .NET

Платформа .NET використовує два основних типи сховищ пам'яті під час виконання додатків: **Стек (Stack)** та **Купу (Heap)**.

* **Стек:** Це швидка область пам'яті, що працює за принципом LIFO. Тут зберігаються локальні змінні значимих типів (int, double, bool, structs) та адреси викликів методів. Пам'ять звільняється автоматично, коли метод завершує роботу.
* **Купа:** Це значно більша область динамічної пам'яті, де зберігаються посилальні типи (об'єкти класів, масиви, рядки). Виділення пам'яті відбувається через оператор `new`.

### Збирач сміття (Garbage Collector)

**Garbage Collector (GC)** — це автоматичний сервіс CLR, який періодично перевіряє купу на наявність об'єктів, на які більше немає активних посилань у стеку чи інших коренях програми, та автоматично звільняє зайняту ними пам'ять.

> **Покоління GC:** Пам'ять у купі поділяється на 3 покоління:
> * **Gen 0:** Нові, щойно створені короткоживучі об'єкти (збирається найчастіше).
> * **Gen 1:** Проміжна буферна зона для об'єктів, що вижили після Gen 0.
> * **Gen 2:** Довгоживучі об'єкти (наприклад, конфігурації, синглтони), перевіряється найрідше."
                            },
                            new Topic
                            {
                                Id = "idisposable-trycatch",
                                Title = "3. Звільнення ресурсів (IDisposable) та обробка помилок",
                                Content = @"### Керовані та некеровані ресурси

**Керовані ресурси:** Це об'єкти у купі, якими повністю опікується Garbage Collector (пам'ять об'єктів).

**Некеровані ресурси:** Це ресурси операційної системи (файлові дескриптори, мережеві підключення, з'єднання з базою даних, графічні контексти). GC не знає, як їх звільняти самостійно.

Для звільнення некерованих ресурсів класи повинні реалізовувати інтерфейс **`IDisposable`** з єдиним методом `Dispose()`.

### Конструкція using

Для автоматичного і надійного виклику методу `Dispose()` (навіть якщо під час роботи виникла помилка) використовується конструкція `using`:

```csharp
using (var reader = new StreamReader(""file.txt"")) {
    Console.WriteLine(reader.ReadLine());
} // Тут reader.Dispose() викличеться автоматично
```

### Обробка виняткових ситуацій (Exceptions)

Для запобігання падінню програми при виникненні помилок використовується блок `try-catch-finally`:

* `try` — містить потенційно небезпечний код.
* `catch` — перехоплює та обробляє помилку (клас `Exception`).
* `finally` — виконується ЗАВЖДИ (для очищення ресурсів), незалежно від виникнення помилок."
                            }
                        },
                        Quizzes = new List<Quiz>
                        {
                            new Quiz { Id = "q3_1", Question = "Де зазвичай зберігаються змінні значимих типів (Value Types) у C#?", Options = new List<string> { "У стеку (Stack)", "У купі (Heap)", "У файлі конфігурації", "У статичній пам'яті" }, CorrectAnswerIndex = 0 },
                            new Quiz { Id = "q3_2", Question = "Що таке Garbage Collector (Збирач сміття) у .NET?", Options = new List<string> { "Утиліта для очищення жорсткого диска", "Автоматична система керування пам'яттю", "Інструмент для видалення старого коду", "Комп'ютерний вірус" }, CorrectAnswerIndex = 1 },
                            new Quiz { Id = "q3_3", Question = "Який тип є посилальним (Reference Type)?", Options = new List<string> { "int", "struct", "class", "bool" }, CorrectAnswerIndex = 2 },
                            new Quiz { Id = "q3_4", Question = "Що буде виведено?", Image = "https://placehold.co/500x160/1e1e1e/4cc9f0?text=int+a+%3D+10%3B%0Aint+b+%3D+a%3B%0Ab+%3D+20%3B%0AConsole.WriteLine(a)%3B", Options = new List<string> { "10", "20", "0", "Помилка" }, CorrectAnswerIndex = 0 },
                            new Quiz { Id = "q3_5", Question = "Для чого використовується інтерфейс IDisposable?", Options = new List<string> { "Для ручного звільнення некерованих ресурсів", "Для створення масивів", "Для підключення до БД", "Для обробки винятків" }, CorrectAnswerIndex = 0 },
                            new Quiz { Id = "q3_6", Question = "Яка конструкція використовується разом з IDisposable для автоматичного виклику Dispose()?", Options = new List<string> { "try-catch", "using", "lock", "fixed" }, CorrectAnswerIndex = 1 },
                            new Quiz { Id = "q3_7", Question = "Що відбувається при присвоєнні одного об'єкта класу іншому?", Image = "https://placehold.co/500x120/1e1e1e/4cc9f0?text=Car+c1+%3D+new+Car()%3B%0ACar+c2+%3D+c1%3B", Options = new List<string> { "Копіюються всі дані об'єкта", "Створюється новий об'єкт", "Копіюється посилання на той самий об'єкт у купі", "Виникає помилка" }, CorrectAnswerIndex = 2 },
                            new Quiz { Id = "q3_8", Question = "Яка звичайна поведінка при упаковці (boxing) значимого типу?", Options = new List<string> { "Немає ключового слова, це відбувається неявно", "box", "pack", "wrap" }, CorrectAnswerIndex = 0 }
                        },
                        Tasks = new List<CourseTask>
                        {
                            new CourseTask
                            {
                                Id = 5,
                                Title = "Завдання 1: Зміна властивостей структури",
                                Description = "Перевірте поведінку структур при передачі копії значення.",
                                Instructions = new List<string>
                                {
                                    "Створіть `struct Point` з полем `public int X`.",
                                    "Створіть метод `static void Modify(Point p)`, який задає `p.X = 10`.",
                                    "Передайте змінну в цей метод та виведіть значення `X` у консоль після виклику методу (воно має залишитись незмінним)."
                                },
                                InitialCode = "using System;\n\nnamespace HelperPlatform\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            \n        }\n    }\n}",
                                ReferenceCode = null
                            },
                            new CourseTask
                            {
                                Id = 6,
                                Title = "Завдання 2: Зміна властивостей класу",
                                Description = "Перевірте поведінку класів при роботі з посиланнями на пам'ять.",
                                Instructions = new List<string>
                                {
                                    "Створіть `class PointClass` з полем `public int X`.",
                                    "Створіть метод `static void Modify(PointClass p)`, який встановлює `p.X = 99`.",
                                    "Передайте екземпляр класу в метод та виведіть значення `X` після виклику (воно зміниться на 99)."
                                },
                                InitialCode = "using System;\n\nnamespace HelperPlatform\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            \n        }\n    }\n}",
                                ReferenceCode = "using System;\n\nnamespace HelperPlatform\n{\n    class PointClass\n    {\n        public int X;\n    }\n\n    class Program\n    {\n        static void Modify(PointClass p)\n        {\n            p.X = 99;\n        }\n\n        static void Main(string[] args)\n        {\n            PointClass point = new PointClass();\n            point.X = 10;\n            Modify(point);\n            Console.WriteLine(point.X); // Виведе 99\n        }\n    }\n}"
                            }
                        }
                    },

                    // MODULE 4
                    new Module
                    {
                        Id = 4,
                        Title = "Модуль 4: Колекції та LINQ",
                        Description = "Опануйте роботу з даними: List, Dictionary, IEnumerable, LINQ-запити та лямбда-вирази.",
                        Order = 4,
                        Topics = new List<Topic>
                        {
                            new Topic
                            {
                                Id = "collections-intro",
                                Title = "1. Колекції в C#",
                                Content = @"### Основи колекцій

Колекції — це спеціальні класи для зберігання та управління групами об'єктів. Вони гнучкіші за звичайні масиви, оскільки можуть динамічно змінювати свій розмір.

* **List\<T\>** — динамічний масив. Найпопулярніша колекція для зберігання списку елементів.
* **Dictionary\<TKey, TValue\>** — словник, який зберігає дані у вигляді пар ""ключ-значення"". Дуже швидкий пошук за ключем.
* **Queue\<T\>** — черга, працює за принципом FIFO (First In, First Out).
* **Stack\<T\>** — стек, працює за принципом LIFO (Last In, First Out)."
                            },
                            new Topic
                            {
                                Id = "linq-lambdas",
                                Title = "2. LINQ (Language Integrated Query) та лямбда-вирази",
                                Content = @"### Що таке LINQ?

**LINQ** — це набір інтегрованих засобів у C# для швидкої, зручної та безпечної вибірки, фільтрації, сортування та групування даних з різних джерел (колекцій у пам'яті, XML, баз даних).

LINQ-запити пишуть двома синтаксисами: *Query Syntax* (схожий на SQL) та *Method Syntax* (виклик методів-розширень, найпопулярніший).

### Основні методи LINQ (Method Syntax)

* **Where:** Фільтрація елементів за умовою.
* **Select:** Проекція (трансформація) елементів в інший тип/форму.
* **OrderBy / OrderByDescending:** Сортування за зростанням/спаданням.
* **FirstOrDefault:** Повертає перший елемент, що відповідає умові, або значення за замовчуванням (null, 0).
* **ToList / ToDictionary:** Перетворення результату запиту у відповідну колекцію.

### Лямбда-вирази

Лямбда-вирази — це короткий запис анонімних функцій. Вони передаються в LINQ як умови або правила проекції:

```csharp
List<int> numbers = new() { 1, 2, 3, 4, 5 };
// Фільтруємо лише парні числа:
var evens = numbers.Where(n => n % 2 == 0).ToList();
```"
                            }
                        },
                        Quizzes = new List<Quiz>
                        {
                            new Quiz { Id = "q4_1", Question = "Яка колекція зберігає дані у вигляді пар 'ключ-значення'?", Options = new List<string> { "List<T>", "Dictionary<TKey, TValue>", "Queue<T>", "Stack<T>" }, CorrectAnswerIndex = 1 },
                            new Quiz { Id = "q4_2", Question = "Що таке LINQ?", Options = new List<string> { "Language-Integrated Query", "Local Integration Network Queue", "Лінійна структура даних", "Бібліотека для графіки" }, CorrectAnswerIndex = 0 },
                            new Quiz { Id = "q4_3", Question = "Що робить метод Where() у LINQ?", Image = "https://placehold.co/500x120/1e1e1e/4cc9f0?text=var+res+%3D+nums.Where(x+%3D%3E+x+%3E+0)%3B", Options = new List<string> { "Сортує елементи", "Повертає перший елемент", "Фільтрує колекцію за умовою", "Видаляє елементи" }, CorrectAnswerIndex = 2 },
                            new Quiz { Id = "q4_4", Question = "Який метод використовується для сортування за зростанням у LINQ?", Options = new List<string> { "SortBy()", "OrderBy()", "Order()", "Arrange()" }, CorrectAnswerIndex = 1 },
                            new Quiz { Id = "q4_5", Question = "Що з цього є лямбда-виразом?", Options = new List<string> { "x => x * 2", "function(x) { return x * 2 }", "def x: x * 2", "x -> x * 2" }, CorrectAnswerIndex = 0 },
                            new Quiz { Id = "q4_6", Question = "Яка колекція працює за принципом LIFO (Last In, First Out)?", Options = new List<string> { "Queue", "Stack", "List", "Dictionary" }, CorrectAnswerIndex = 1 },
                            new Quiz { Id = "q4_7", Question = "Який інтерфейс є базовим для всіх колекцій LINQ?", Options = new List<string> { "ICollection", "IList", "IEnumerable", "IDictionary" }, CorrectAnswerIndex = 2 },
                            new Quiz { Id = "q4_8", Question = "Як отримати кількість елементів у списку List<int>?", Options = new List<string> { "list.Length", "list.Size()", "list.Count", "list.Items" }, CorrectAnswerIndex = 2 }
                        },
                        Tasks = new List<CourseTask>
                        {
                            new CourseTask
                            {
                                Id = 15,
                                Title = "Завдання 1: Фільтрація списку за допомогою LINQ",
                                Description = "Створіть програму, яка фільтрує список чисел за допомогою LINQ.",
                                Instructions = new List<string>
                                {
                                    "Оголосіть список цілих чисел `List<int> numbers = new() { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };`.",
                                    "За допомогою LINQ-методу `Where` відфільтруйте лише числа, які більші за `5`.",
                                    "Виведіть кожне відфільтроване число в консоль у точному форматі: `Number: [число]` (наприклад: `Number: 6`)."
                                },
                                InitialCode = "using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\nnamespace HelperPlatform\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            // Напишіть ваш LINQ-запит тут:\n            \n        }\n    }\n}",
                                ReferenceCode = "using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\nnamespace HelperPlatform\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            List<int> numbers = new() { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };\n            var filtered = numbers.Where(n => n > 5);\n            foreach (var num in filtered)\n            {\n                Console.WriteLine(\"Number: \" + num);\n            }\n        }\n    }\n}"
                            },
                            new CourseTask
                            {
                                Id = 16,
                                Title = "Завдання 2: Пошук у словнику (Dictionary)",
                                Description = "Створіть словник та перевірте наявність елементів за ключем.",
                                Instructions = new List<string>
                                {
                                    "Створіть словник `Dictionary<string, string> capitals = new();`.",
                                    "Додайте пари: `\"Ukraine\" -> \"Kyiv\"`, `\"Poland\" -> \"Warsaw\"`, `\"Germany\" -> \"Berlin\"`.",
                                    "Перевірте, чи словник містить ключ `\"Ukraine\"` за допомогою `ContainsKey`.",
                                    "Якщо містить, виведіть у консоль: `Capital: [значення]` (має вивести `Capital: Kyiv`)."
                                },
                                InitialCode = "using System;\nusing System.Collections.Generic;\n\nnamespace HelperPlatform\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            // Створіть словник, додайте пари та перевірте наявність ключа:\n            \n        }\n    }\n}",
                                ReferenceCode = "using System;\nusing System.Collections.Generic;\n\nnamespace HelperPlatform\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            Dictionary<string, string> capitals = new();\n            capitals.Add(\"Ukraine\", \"Kyiv\");\n            capitals.Add(\"Poland\", \"Warsaw\");\n            capitals.Add(\"Germany\", \"Berlin\");\n            \n            if (capitals.ContainsKey(\"Ukraine\"))\n            {\n                Console.WriteLine(\"Capital: \" + capitals[\"Ukraine\"]);\n            }\n        }\n    }\n}"
                            }
                        }
                    },

                    // MODULE 5
                    new Module
                    {
                        Id = 5,
                        Title = "Модуль 5: Асинхронне програмування",
                        Description = "Вивчіть Task, async/await, паралельне виконання та потоки для створення швидких додатків.",
                        Order = 5,
                        Topics = new List<Topic>
                        {
                            new Topic
                            {
                                Id = "async-await-intro",
                                Title = "1. Основи async / await",
                                Content = @"### Асинхронність у C#

Асинхронне програмування дозволяє виконувати довготривалі операції (наприклад, завантаження файлів з інтернету) без блокування основного потоку виконання.

Основні ключові слова: `async` та `await`. Метод, позначений як `async`, може використовувати `await` для очікування результату виконання іншого асинхронного завдання (Task)."
                            },
                            new Topic
                            {
                                Id = "async-parallel-error",
                                Title = "2. Паралельне виконання та обробка помилок",
                                Content = @"### Паралельний запуск завдань

Якщо у вас є кілька незалежних асинхронних операцій, краще запустити їх паралельно, а не послідовно. Для цього використовується метод `Task.WhenAll`:

```csharp
Task<string> task1 = FetchFromDatabaseAsync();
Task<string> task2 = FetchFromWebApiAsync();

// Запускаємо паралельно та чекаємо на обидва:
await Task.WhenAll(task1, task2);
Console.WriteLine(task1.Result + task2.Result);
```

### Обробка помилок в асинхронному коді

Для обробки виняткових ситуацій в асинхронних методах використовується звичайний блок `try-catch` навколо виклику з `await`:

```csharp
try {
    await Task.Delay(1000);
    throw new Exception(""Помилка!"");
} catch (Exception ex) {
    Console.WriteLine(ex.Message);
}
```"
                            }
                        },
                        Quizzes = new List<Quiz>
                        {
                            new Quiz { Id = "q5_1", Question = "Які ключове слова використовуються для асинхронних методів у C#?", Options = new List<string> { "yield / return", "async / await", "thread / lock", "wait / pulse" }, CorrectAnswerIndex = 1 },
                            new Quiz { Id = "q5_2", Question = "Що повертає асинхронний метод, який не має конкретного значення повернення?", Options = new List<string> { "void", "Task", "null", "Thread" }, CorrectAnswerIndex = 1 },
                            new Quiz { Id = "q5_3", Question = "Який метод використовується для запуску затримки в асинхронному коді?", Image = "https://placehold.co/500x120/1e1e1e/4cc9f0?text=await+%5B%3F%5D.Delay(1000)%3B", Options = new List<string> { "Thread.Sleep", "Task.Delay", "Timer.Wait", "Process.Suspend" }, CorrectAnswerIndex = 1 },
                            new Quiz { Id = "q5_4", Question = "Що станеться, якщо викликати Thread.Sleep у головному (UI) потоці?", Options = new List<string> { "Потік призупиниться, але UI буде працювати", "Додаток повністю зависне (UI freeze)", "Код виконається асинхронно", "Виникне виняток компіляції" }, CorrectAnswerIndex = 1 },
                            new Quiz { Id = "q5_5", Question = "Як дочекатися виконання одразу кількох асинхронних завдань?", Options = new List<string> { "Task.WaitAll()", "Task.WhenAll()", "await Task.All()", "Task.Group()" }, CorrectAnswerIndex = 1 },
                            new Quiz { Id = "q5_6", Question = "Що таке Deadlock (взаємне блокування)?", Options = new List<string> { "Помилка підключення до БД", "Ситуація, коли два потоки нескінченно чекають один одного", "Коли пам'ять повністю заповнена", "Коли метод повертає null" }, CorrectAnswerIndex = 1 },
                            new Quiz { Id = "q5_7", Question = "Яке ключове слово захищає блок коду від одночасного доступу кількох потоків?", Options = new List<string> { "secure", "lock", "protect", "safe" }, CorrectAnswerIndex = 1 },
                            new Quiz { Id = "q5_8", Question = "Чи можна використовувати 'await' всередині 'lock'?", Options = new List<string> { "Так, без проблем", "Ні, це призведе до помилки компіляції", "Так, але лише у статичних методах", "Так, якщо lock містить try-catch" }, CorrectAnswerIndex = 1 }
                        },
                        Tasks = new List<CourseTask>
                        {
                            new CourseTask
                            {
                                Id = 17,
                                Title = "Завдання 1: Асинхронна затримка",
                                Description = "Створіть асинхронний метод з використанням Task.Delay.",
                                Instructions = new List<string>
                                {
                                    "Створіть асинхронний метод `static async Task WaitAndPrint()`.",
                                    "Всередині методу за допомогою `await Task.Delay(500)` зачекайте 500 мілісекунд.",
                                    "Після затримки виведіть у консоль: `Delay completed`.",
                                    "У методі `Main` викличте `WaitAndPrint().Wait();`."
                                },
                                InitialCode = "using System;\nusing System.Threading.Tasks;\n\nnamespace HelperPlatform\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            // Викличте асинхронний метод WaitAndPrint:\n            \n        }\n        \n        // Оголосіть асинхронний метод WaitAndPrint тут:\n        \n    }\n}",
                                ReferenceCode = "using System;\nusing System.Threading.Tasks;\n\nnamespace HelperPlatform\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            WaitAndPrint().Wait();\n        }\n        \n        static async Task WaitAndPrint()\n        {\n            await Task.Delay(500);\n            Console.WriteLine(\"Delay completed\");\n        }\n    }\n}"
                            },
                            new CourseTask
                            {
                                Id = 18,
                                Title = "Завдання 2: Паралельний запуск кількох асинхронних завдань",
                                Description = "Запустіть два асинхронних завдання паралельно за допомогою Task.WhenAll.",
                                Instructions = new List<string>
                                {
                                    "Створіть два асинхронних методи: `static async Task<string> FetchData1()` (повертає `\"Data1\"` після затримки `300ms`) та `static async Task<string> FetchData2()` (повертає `\"Data2\"` після затримки `200ms`).",
                                    "У методі `Main` (оголошеному як `static async Task Main(string[] args)`) запустіть обидва методи паралельно: `Task<string> t1 = FetchData1(); Task<string> t2 = FetchData2();`.",
                                    "Зачекайте на завершення обох завдань за допомогою `await Task.WhenAll(t1, t2)`.",
                                    "Виведіть результати у консоль у точному форматі: `Result: [t1] and [t2]` (має вивести `Result: Data1 and Data2`)."
                                },
                                InitialCode = "using System;\nusing System.Threading.Tasks;\n\nnamespace HelperPlatform\n{\n    class Program\n    {\n        static async Task Main(string[] args)\n        {\n            // Напишіть код для паралельного виконання завдань тут:\n            \n        }\n        \n        // Оголосіть методи FetchData1 та FetchData2 тут:\n        \n    }\n}",
                                ReferenceCode = "using System;\nusing System.Threading.Tasks;\n\nnamespace HelperPlatform\n{\n    class Program\n    {\n        static async Task Main(string[] args)\n        {\n            Task<string> t1 = FetchData1();\n            Task<string> t2 = FetchData2();\n            \n            await Task.WhenAll(t1, t2);\n            \n            Console.WriteLine(\"Result: \" + t1.Result + \" and \" + t2.Result);\n        }\n        \n        static async Task<string> FetchData1()\n        {\n            await Task.Delay(300);\n            return \"Data1\";\n        }\n        \n        static async Task<string> FetchData2()\n        {\n            await Task.Delay(200);\n            return \"Data2\";\n        }\n    }\n}"
                            }
                        }
                    },

                    // MODULE 6 (NEW)
                    new Module
                    {
                        Id = 6,
                        Title = "Модуль 6: Делегати, події та лямбда-вирази",
                        Description = "Просунутий рівень: Делегати (Func, Action, Predicate), Події (Events), Лямбда-вирази та анонімні методи.",
                        Order = 6,
                        Topics = new List<Topic>
                        {
                            new Topic
                            {
                                Id = "delegates-events",
                                Title = "1. Делегати та події",
                                Content = @"### Делегати в C#

**Делегат** — це безпечний тип посилання на метод (вказівник на функцію). Він дозволяє передавати методи як параметри в інші методи.

Основні вбудовані типи делегатів у системній бібліотеці .NET:

* **Action\<T\>** — делегат для методів, які приймають параметр(и) і **нічого не повертають** (тип повернення `void`).
* **Func\<T, TResult\>** — делегат для методів, які приймають параметр(и) і **обов'язково повертають** значення типу `TResult`.
* **Predicate\<T\>** — делегат, який завжди приймає один параметр і повертає логічне значення `bool` (найчастіше для фільтрації).

### Події (Events)

Події дозволяють класу повідомляти інші класи про те, що щось сталося. Вони базуються на делегатах, але надають вищий рівень безпеки (їх не можна перезаписати напряму, можна лише підписатися `+=` чи відписатися `-=`)."
                            },
                            new Topic
                            {
                                Id = "lambda-anonymous",
                                Title = "2. Лямбда-вирази та анонімні методи",
                                Content = @"### Лямбда-вирази

**Лямбда-вираз** — це анонімна функція, яку можна використовувати для створення делегатів або дерев виразів. Вони записуються за допомогою лямбда-оператора `=>` (читається як ""переходить у"").

```csharp
// Лямбда-вираз для додавання двох чисел:
Func<int, int, int> sum = (x, y) => x + y;
Console.WriteLine(sum(5, 10)); // Виведе 15
```

Лямбда-вирази є надзвичайно корисними в LINQ-запитах для лаконічного написання умов фільтрації та проекції даних."
                            }
                        },
                        Quizzes = new List<Quiz>
                        {
                            new Quiz { Id = "q6_1", Question = "Який вбудований делегат повертає значення?", Options = new List<string> { "Action", "Func", "Predicate", "Task" }, CorrectAnswerIndex = 1 },
                            new Quiz { Id = "q6_2", Question = "Яке ключове слово використовується для оголошення події?", Options = new List<string> { "event", "delegate", "raise", "subscribe" }, CorrectAnswerIndex = 0 },
                            new Quiz { Id = "q6_3", Question = "Що таке анонімний метод?", Options = new List<string> { "Метод без імені", "Метод без тіла", "Метод без параметрів", "Метод без типу повернення" }, CorrectAnswerIndex = 0 },
                            new Quiz { Id = "q6_4", Question = "Який тип завжди повертає делегат Predicate<T>?", Options = new List<string> { "void", "T", "bool", "int" }, CorrectAnswerIndex = 2 },
                            new Quiz { Id = "q6_5", Question = "Який вбудований делегат використовується для методів, що приймають параметри і нічого не повертають?", Options = new List<string> { "Func", "Action", "Predicate", "Task" }, CorrectAnswerIndex = 1 },
                            new Quiz { Id = "q6_6", Question = "Що відбудеться, якщо викликати подію (event), на яку ніхто не підписаний (null)?", Options = new List<string> { "Подія проігнорується", "Виникне NullReferenceException", "Програма завершиться без помилки", "Помилка компіляції" }, CorrectAnswerIndex = 1 },
                            new Quiz { Id = "q6_7", Question = "Який оператор використовується для підписки на подію?", Options = new List<string> { "=", "+=", "->", "subscribe" }, CorrectAnswerIndex = 1 },
                            new Quiz { Id = "q6_8", Question = "Яким оператором записуються лямбда-вирази у C#?", Options = new List<string> { "->", "=>", "::", "lambda" }, CorrectAnswerIndex = 1 }
                        },
                        Tasks = new List<CourseTask>
                        {
                            new CourseTask
                            {
                                Id = 7,
                                Title = "Завдання 1: Фільтрація чисел за допомогою Predicate",
                                Description = "Створіть програму, яка фільтрує список чисел за допомогою вбудованого делегата Predicate.",
                                Instructions = new List<string>
                                {
                                    "Оголосіть список цілих чисел `List<int> numbers = new() { 1, 2, 3, 4, 5, 6 };`.",
                                    "Створіть Predicate `Predicate<int> isEven = x => x % 2 == 0;`.",
                                    "Пройдіться по списку і виведіть лише парні числа у консоль у точному форматі: `Even: [число]` (наприклад: `Even: 2`, `Even: 4`)."
                                },
                                InitialCode = "using System;\nusing System.Collections.Generic;\n\nnamespace HelperPlatform\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            // Напишіть ваш код тут:\n            \n        }\n    }\n}",
                                ReferenceCode = "using System;\nusing System.Collections.Generic;\n\nnamespace HelperPlatform\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            List<int> numbers = new() { 1, 2, 3, 4, 5, 6 };\n            Predicate<int> isEven = x => x % 2 == 0;\n            \n            foreach (int num in numbers)\n            {\n                if (isEven(num))\n                {\n                    Console.WriteLine(\"Even: \" + num);\n                }\n            }\n        }\n    }\n}"
                            },
                            new CourseTask
                            {
                                Id = 8,
                                Title = "Завдання 2: Створення та підписка на подію",
                                Description = "Реалізуйте підписку на подію OnClick класу Button.",
                                Instructions = new List<string>
                                {
                                    "Оголосіть делегат `delegate void ClickHandler()` у просторі імен.",
                                    "У класі `Button` створіть подію `public event ClickHandler OnClick`.",
                                    "Реалізуйте у класі `Button` публічний метод `public void Click()` який викликає подію, якщо є підписники (використовуйте `OnClick?.Invoke()`).",
                                    "У методі `Main` створіть об'єкт `Button btn = new Button();`, підпишіться на подію OnClick (виведіть у консоль `Button clicked!`) та викличте метод `btn.Click()`."
                                },
                                InitialCode = "using System;\n\nnamespace HelperPlatform\n{\n    // Оголосіть делегат тут\n    \n    class Program\n    {\n        static void Main(string[] args)\n        {\n            // Створіть кнопку, підпишіться на подію та викличте Click():\n            \n        }\n    }\n\n    class Button\n    {\n        // Оголосіть подію та метод Click() тут:\n        \n    }\n}",
                                ReferenceCode = "using System;\n\nnamespace HelperPlatform\n{\n    public delegate void ClickHandler();\n    \n    class Program\n    {\n        static void Main(string[] args)\n        {\n            Button btn = new Button();\n            btn.OnClick += () => Console.WriteLine(\"Button clicked!\");\n            btn.Click();\n        }\n    }\n\n    class Button\n    {\n        public event ClickHandler OnClick;\n        \n        public void Click()\n        {\n            OnClick?.Invoke();\n        }\n    }\n}"
                            }
                        }
                    },

                    // MODULE 7 (NEW)
                    new Module
                    {
                        Id = 7,
                        Title = "Модуль 7: Рефлексія, атрибути та метапрограмування",
                        Description = "Просунутий рівень: Дослідження метаданих типів, динамічне створення об'єктів, кастомні атрибути.",
                        Order = 7,
                        Topics = new List<Topic>
                        {
                            new Topic
                            {
                                Id = "reflection-attributes",
                                Title = "1. Рефлексія та атрибути у C#",
                                Content = @"### Що таке рефлексія?

**Рефлексія (Reflection)** — це механізм, який дозволяє досліджувати метадані про класи, інтерфейси, методи та поля прямо під час виконання програми (Runtime). Ви можете дізнатися всі методи класу, створити об'єкт за його текстовим іменем або викликати приватний метод.

```csharp
Type myType = typeof(MyClass);
Console.WriteLine(myType.FullName);
```

### Атрибути (Attributes)

**Атрибути** дозволяють додавати декларативну інформацію (метадані) до коду (класів, властивостей, методів). Вони записуються в квадратних дужках `[MyAttribute]` та зчитуються за допомогою тієї ж Рефлексії."
                            },
                            new Topic
                            {
                                Id = "dynamic-instantiation",
                                Title = "2. Динамічне створення об'єктів та виклик методів",
                                Content = @"### Динамічне створення об'єктів

Рефлексія дозволяє створювати екземпляри класів у Runtime, коли ім'я класу відоме лише у вигляді рядка тексту. Для цього використовується клас `Activator`:

```csharp
Type t = typeof(MyClass);
object instance = Activator.CreateInstance(t);
```

Також можна отримати опис конкретного методу через `MethodInfo` і викликати його за допомогою методу `Invoke`, передаючи об'єкт та його параметри."
                            }
                        },
                        Quizzes = new List<Quiz>
                        {
                            new Quiz { Id = "q7_1", Question = "Який клас використовується для отримання інформації про типи у рантаймі?", Options = new List<string> { "Class", "Type", "System", "Reflection" }, CorrectAnswerIndex = 1 },
                            new Quiz { Id = "q7_2", Question = "Як створити екземпляр класу динамічно за допомогою рефлексії?", Options = new List<string> { "new Type()", "Activator.CreateInstance()", "Type.Create()", "Reflection.New()" }, CorrectAnswerIndex = 1 },
                            new Quiz { Id = "q7_3", Question = "Який базовий клас успадковують всі атрибути в .NET?", Options = new List<string> { "Attribute", "Metadata", "Tag", "Marker" }, CorrectAnswerIndex = 0 },
                            new Quiz { Id = "q7_4", Question = "Яким символом позначається застосування атрибута в C#?", Options = new List<string> { "()", "[]", "{}", "<>" }, CorrectAnswerIndex = 1 },
                            new Quiz { Id = "q7_5", Question = "Який простір імен містить типи для роботи з рефлексією?", Options = new List<string> { "System.IO", "System.Reflection", "System.Linq", "System.Diagnostics" }, CorrectAnswerIndex = 1 },
                            new Quiz { Id = "q7_6", Question = "Як отримати тип об'єкта змінної x?", Options = new List<string> { "x.Type()", "x.GetType()", "typeof(x)", "Type.Get(x)" }, CorrectAnswerIndex = 1 },
                            new Quiz { Id = "q7_7", Question = "Що робить метод GetProperties() класу Type?", Options = new List<string> { "Повертає всі поля класу", "Повертає всі публічні властивості типу", "Створює нові властивості", "Видаляє властивості" }, CorrectAnswerIndex = 1 },
                            new Quiz { Id = "q7_8", Question = "Чи дозволяє рефлексія отримати доступ до приватних полів та методів класу?", Options = new List<string> { "Ні, це неможливо за правилами безпеки CLR", "Так, за допомогою правильних BindingFlags", "Так, але лише в консольних додатках", "Так, але лише якщо клас абстрактний" }, CorrectAnswerIndex = 1 }
                        },
                        Tasks = new List<CourseTask>
                        {
                            new CourseTask
                            {
                                Id = 9,
                                Title = "Завдання 1: Читання властивостей класу через Рефлексію",
                                Description = "Створіть програму для зчитування назв та значень властивостей об'єкта за допомогою рефлексії.",
                                Instructions = new List<string>
                                {
                                    "У методі `Main` створіть об'єкт `Student student = new Student { Name = \"Ivan\", Age = 21 };`.",
                                    "За допомогою рефлексії отримайте всі властивості класу `Student` (`GetProperties()`).",
                                    "Виведіть у консоль ім'я кожної властивості та її значення на об'єкті у форматі: `[Назва] = [Значення]` (наприклад: `Name = Ivan`)."
                                },
                                InitialCode = "using System;\nusing System.Reflection;\n\nnamespace HelperPlatform\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            // Напишіть ваш код тут:\n            \n        }\n    }\n\n    class Student\n    {\n        public string Name { get; set; }\n        public int Age { get; set; }\n    }\n}",
                                ReferenceCode = "using System;\nusing System.Reflection;\n\nnamespace HelperPlatform\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            Student student = new Student { Name = \"Ivan\", Age = 21 };\n            Type type = student.GetType();\n            PropertyInfo[] properties = type.GetProperties();\n            \n            foreach (PropertyInfo prop in properties)\n            {\n                Console.WriteLine(prop.Name + \" = \" + prop.GetValue(student));\n            }\n        }\n    }\n\n    class Student\n    {\n        public string Name { get; set; }\n        public int Age { get; set; }\n    }\n}"
                            },
                            new CourseTask
                            {
                                Id = 10,
                                Title = "Завдання 2: Динамічний виклик приватного методу",
                                Description = "Викличте приватний метод класу SecretVault за допомогою рефлексії.",
                                Instructions = new List<string>
                                {
                                    "У методі `Main` створіть екземпляр `SecretVault vault = new SecretVault();`.",
                                    "Отримайте `Type type = typeof(SecretVault);`.",
                                    "Отримайте опис приватного методу `ShowSecret` за допомогою `type.GetMethod(\"ShowSecret\", BindingFlags.NonPublic | BindingFlags.Instance)`.",
                                    "Викличте знайдений метод `ShowSecret` на об'єкті `vault` за допомогою `Invoke` (передавши `vault` та `null` як аргументи)."
                                },
                                InitialCode = "using System;\nusing System.Reflection;\n\nnamespace HelperPlatform\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            // Викличте приватний метод ShowSecret за допомогою рефлексії:\n            \n        }\n    }\n\n    class SecretVault\n    {\n        private void ShowSecret()\n        {\n            Console.WriteLine(\"Secret Code: CS_SUPER_HERO\");\n        }\n    }\n}",
                                ReferenceCode = "using System;\nusing System.Reflection;\n\nnamespace HelperPlatform\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            SecretVault vault = new SecretVault();\n            Type type = typeof(SecretVault);\n            MethodInfo method = type.GetMethod(\"ShowSecret\", BindingFlags.NonPublic | BindingFlags.Instance);\n            method.Invoke(vault, null);\n        }\n    }\n\n    class SecretVault\n    {\n        private void ShowSecret()\n        {\n            Console.WriteLine(\"Secret Code: CS_SUPER_HERO\");\n        }\n    }\n}"
                            }
                        }
                    },

                    // MODULE 8 (NEW)
                    new Module
                    {
                        Id = 8,
                        Title = "Модуль 8: Паттерни проектування та архітектурні принципи (SOLID)",
                        Description = "Архітектура: Принципи SOLID (SRP, OCP, LSP, ISP, DIP) та основні патерни (Singleton, Factory, Observer).",
                        Order = 8,
                        Topics = new List<Topic>
                        {
                            new Topic
                            {
                                Id = "solid-principles",
                                Title = "1. Принципи SOLID та патерни",
                                Content = @"### Архітектурні принципи SOLID

**SOLID** — це 5 базових принципів об'єктно-орієнтованого програмування для створення гнучкої та підтримуваної архітектури:

1. **S (Single Responsibility)** — Принцип єдиної відповідальності. У класу має бути лише одна причина для змін.
2. **O (Open/Closed)** — Принцип відкритості/закритості. Класи відкриті для розширення, але закриті для модифікації.
3. **L (Liskov Substitution)** — Принцип підстановки Барбари Лісков. Об'єкти базового класу можна замінити об'єктами похідних класів без руйнування логіки програми.
4. **I (Interface Segregation)** — Принцип розділення інтерфейсу. Краще створити багато малих спеціалізованих інтерфейсів, ніж один великий універсальний.
5. **D (Dependency Inversion)** — Принцип інверсії залежностей. Модулі високого рівня не повинні залежати від модулів низького рівня. Обидва повинні залежати від абстракцій."
                            },
                            new Topic
                            {
                                Id = "design-patterns-practice",
                                Title = "2. Практика застосування патернів",
                                Content = @"### Патерни проектування GoF

Патерни проектування — це перевірені часом типові вирішення архітектурних проблем в об'єктно-орієнтованому програмування.

* **Singleton (Одинак)** — Гарантує, що у класу буде лише один єдиний екземпляр у пам'яті та надає глобальну точку доступу до нього.
* **Factory Method (Фабричний метод)** — Визначає інтерфейс для створення об'єкта, але залишає підкласам вибір того, який саме клас створювати.
* **Observer (Спостерігач)** — Створює залежність ""один-до-багатьох"", де зміна стану одного об'єкта викликає сповіщення та автоматичне оновлення всіх залежних об'єктів."
                            }
                        },
                        Quizzes = new List<Quiz>
                        {
                            new Quiz { Id = "q8_1", Question = "Що означає літера 'S' у SOLID?", Options = new List<string> { "Single Responsibility Principle", "Static Class", "System Design", "Source Code" }, CorrectAnswerIndex = 0 },
                            new Quiz { Id = "q8_2", Question = "Який патерн гарантує, що у класу буде лише один єдиний екземпляр у пам'яті?", Options = new List<string> { "Factory", "Singleton", "Observer", "Builder" }, CorrectAnswerIndex = 1 },
                            new Quiz { Id = "q8_3", Question = "Який принцип SOLID стверджує, що класи мають бути відкритими для розширення, але закритими для модифікації?", Options = new List<string> { "SRP", "OCP", "LSP", "ISP" }, CorrectAnswerIndex = 1 },
                            new Quiz { Id = "q8_4", Question = "Який патерн використовується для автоматичного сповіщення багатьох об'єктів про зміни стану іншого об'єкта?", Options = new List<string> { "Observer", "Strategy", "Decorator", "Adapter" }, CorrectAnswerIndex = 0 },
                            new Quiz { Id = "q8_5", Question = "Який принцип SOLID порушено, якщо клас виконує одночасно і розрахунки, і збереження результатів у файл, і виведення їх на екран?", Options = new List<string> { "SRP", "LSP", "ISP", "DIP" }, CorrectAnswerIndex = 0 },
                            new Quiz { Id = "q8_6", Question = "Відповідно до якого принципу SOLID рекомендується залежати від абстракцій (інтерфейсів), а не від конкретних класів?", Options = new List<string> { "SRP", "OCP", "LSP", "DIP" }, CorrectAnswerIndex = 3 },
                            new Quiz { Id = "q8_7", Question = "Який принцип SOLID вимагає, щоб підкласи могли повністю замінювати свої базові класи без порушення роботи програми?", Options = new List<string> { "OCP", "LSP", "ISP", "DIP" }, CorrectAnswerIndex = 1 },
                            new Quiz { Id = "q8_8", Question = "Який патерн створює об'єкти без розкриття внутрішньої логіки створення клієнту?", Options = new List<string> { "Singleton", "Factory Method", "Adapter", "Proxy" }, CorrectAnswerIndex = 1 }
                        },
                        Tasks = new List<CourseTask>
                        {
                            new CourseTask
                            {
                                Id = 11,
                                Title = "Завдання 1: Шаблон проектування Singleton",
                                Description = "Створіть потокобезпечний клас Singleton для підключення до Бази Даних.",
                                Instructions = new List<string>
                                {
                                    "Оголосіть клас `DatabaseConnection`.",
                                    "Зробіть його конструктор приватним.",
                                    "Створіть приватне статичне поле `DatabaseConnection instance = null;`.",
                                    "Створіть публічну статичну властивість `Instance` (або метод `GetInstance()`).",
                                    "При першому зверненні створіть новий об'єкт `DatabaseConnection` та виведіть у консоль `DB Connection Established`.",
                                    "У `Main` отримайте інстанс двічі та перевірте, що ви повідомлення вивелося лише 1 раз."
                                },
                                InitialCode = "using System;\n\nnamespace HelperPlatform\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            // Отримайте інстанс двічі:\n            DatabaseConnection db1 = DatabaseConnection.Instance;\n            DatabaseConnection db2 = DatabaseConnection.Instance;\n        }\n    }\n\n    // Оголосіть Singleton клас DatabaseConnection тут:\n    class DatabaseConnection\n    {\n        \n    }\n}",
                                ReferenceCode = "using System;\n\nnamespace HelperPlatform\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            DatabaseConnection db1 = DatabaseConnection.Instance;\n            DatabaseConnection db2 = DatabaseConnection.Instance;\n        }\n    }\n\n    class DatabaseConnection\n    {\n        private static DatabaseConnection _instance;\n        private static readonly object _lock = new object();\n        \n        private DatabaseConnection()\n        {\n            Console.WriteLine(\"DB Connection Established\");\n        }\n        \n        public static DatabaseConnection Instance\n        {\n            get\n            {\n                lock (_lock)\n                {\n                    if (_instance == null)\n                    {\n                        _instance = new DatabaseConnection();\n                    }\n                    return _instance;\n                }\n            }\n        }\n    }\n}"
                            },
                            new CourseTask
                            {
                                Id = 12,
                                Title = "Завдання 2: Інверсія залежностей (DIP)",
                                Description = "Спроектуйте класи згідно з принципом інверсії залежностей за допомогою інтерфейсу.",
                                Instructions = new List<string>
                                {
                                    "Створіть інтерфейс `IMessageSender` з методом `void Send(string msg)`.",
                                    "Реалізуйте його у класі `EmailSender`, де метод `Send` виводить у консоль: `Email: [msg]`.",
                                    "Створіть клас `NotificationService` який приймає `IMessageSender` через конструктор і зберігає його в приватне поле.",
                                    "У класі `NotificationService` реалізуйте метод `public void Notify(string text)` який викликає метод `Send(text)` нашого сендера.",
                                    "У `Main` створіть `IMessageSender sender = new EmailSender();`, передайте його в конструктор `NotificationService` та викличте метод `Notify(\"Hello\")`."
                                },
                                InitialCode = "using System;\n\nnamespace HelperPlatform\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            // Напишіть ваш код тут:\n            \n        }\n    }\n\n    // Створіть інтерфейс IMessageSender, клас EmailSender та клас NotificationService тут:\n    \n}",
                                ReferenceCode = "using System;\n\nnamespace HelperPlatform\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            IMessageSender sender = new EmailSender();\n            NotificationService service = new NotificationService(sender);\n            service.Notify(\"Hello\");\n        }\n    }\n\n    interface IMessageSender\n    {\n        void Send(string msg);\n    }\n\n    class EmailSender : IMessageSender\n    {\n        public void Send(string msg)\n        {\n            Console.WriteLine(\"Email: \" + msg);\n        }\n    }\n\n    class NotificationService\n    {\n        private readonly IMessageSender _sender;\n        \n        public NotificationService(IMessageSender sender)\n        {\n            _sender = sender;\n        }\n        \n        public void Notify(string text)\n        {\n            _sender.Send(text);\n        }\n    }\n}"
                            }
                        }
                    },

                    // MODULE 9 (NEW)
                    new Module
                    {
                        Id = 9,
                        Title = "Модуль 9: Багатопотоковість та паралельне виконання",
                        Description = "Професійний рівень: Потоки (Thread), синхронізація потоків (lock, Monitor), клас Parallel, PLINQ.",
                        Order = 9,
                        Topics = new List<Topic>
                        {
                            new Topic
                            {
                                Id = "multithreading",
                                Title = "1. Потоки та синхронізація",
                                Content = @"### Основи багатопотоковості

Багатопотоковість дозволяє додатку виконувати кілька завдань одночасно, розподіляючи їх між ядрами процесора.

Ключові поняття:

* **Thread (Потік)** — найменший юніт виконання в ОС.
* **Race Condition (Стан гонки)** — помилка, коли кілька потоків одночасно намагаються змінити спільну змінну без належної синхронізації, що призводить до псування даних.
* **lock** — оператор взаємного виключення. Він створює блок коду, в який може зайти лише один потік одночасно, блокуючи інші.

```csharp
private static object locker = new object();
lock(locker) {
    // Безпечний для потоків код
}
```"
                            },
                            new Topic
                            {
                                Id = "parallel-plinq",
                                Title = "2. Клас Parallel та PLINQ",
                                Content = @"### Клас Parallel

Клас `System.Threading.Tasks.Parallel` спрощує паралельне виконання циклів. Замість ручного створення потоків, він автоматично розподіляє роботу циклу по всіх вільних ядрах процесора:

```csharp
Parallel.For(0, 10, i => {
    Console.WriteLine($""Task {i} executed in thread {Thread.CurrentThread.ManagedThreadId}"");
});
```

### Parallel LINQ (PLINQ)

**PLINQ** — це паралельна реалізація технології LINQ. Метод `AsParallel()` розпаралелює виконання LINQ-запиту, значно прискорюючи фільтрацію та обробку великих колекцій даних."
                            }
                        },
                        Quizzes = new List<Quiz>
                        {
                            new Quiz { Id = "q9_1", Question = "Яке ключове слово в C# використовується для забезпечення взаємного виключення потоків?", Options = new List<string> { "lock", "sync", "thread", "block" }, CorrectAnswerIndex = 0 },
                            new Quiz { Id = "q9_2", Question = "Який пул використовується для уникнення витрат на постійне створення та знищення нових потоків?", Options = new List<string> { "ThreadPool", "TaskPool", "MemoryPool", "GC" }, CorrectAnswerIndex = 0 },
                            new Quiz { Id = "q9_3", Question = "Що таке стан гонки (Race Condition)?", Options = new List<string> { "Коли потоки працюють занадто швидко", "Коли кілька потоків одночасно модифікують спільні дані без синхронізації", "Коли потік завершується з помилкою", "Коли програма зависає" }, CorrectAnswerIndex = 1 },
                            new Quiz { Id = "q9_4", Question = "Який допоміжний клас у .NET дозволяє легко виконувати паралельні цикли?", Options = new List<string> { "Parallel", "Thread", "Task", "Loop" }, CorrectAnswerIndex = 0 },
                            new Quiz { Id = "q9_5", Question = "Який метод класу Parallel використовується для паралельного обходу колекцій?", Options = new List<string> { "Parallel.ForEach", "Parallel.For", "Parallel.Invoke", "Parallel.Run" }, CorrectAnswerIndex = 0 },
                            new Quiz { Id = "q9_6", Question = "Як увімкнути паралельне виконання LINQ-запиту?", Options = new List<string> { "AsParallel()", "RunParallel()", "ToParallel()", "UseThreads()" }, CorrectAnswerIndex = 0 },
                            new Quiz { Id = "q9_7", Question = "Який допоміжний клас у C# надає швидкі та безпечні атомарні операції для змінних?", Options = new List<string> { "Monitor", "Interlocked", "Mutex", "Semaphore" }, CorrectAnswerIndex = 1 },
                            new Quiz { Id = "q9_8", Question = "Що робить метод Task.Delay?", Options = new List<string> { "Блокує поточний потік процесора", "Повертає завдання, яке завершується через вказаний інтервал часу без блокування потоку", "Викликає збирач сміття", "Зупиняє роботу ОС" }, CorrectAnswerIndex = 1 }
                        },
                        Tasks = new List<CourseTask>
                        {
                            new CourseTask
                            {
                                Id = 13,
                                Title = "Завдання 1: Безпечне інкрементування лічильника через Interlocked",
                                Description = "Створіть потокобезпечну програму для збільшення лічильника за допомогою класу Interlocked.",
                                Instructions = new List<string>
                                {
                                    "Створіть клас `Program` зі статичним полем `public static int counter = 0;`.",
                                    "У методі `Main` запустіть паралельний цикл `Parallel.For(0, 1000, i => { ... })`.",
                                    "Всередині циклу збільшіть лічильник безпечно за допомогою атомарного методу `Interlocked.Increment(ref counter)`.",
                                    "Після завершення циклу виведіть лічильник у консоль у форматі: `Counter: [значення]` (має вивести 1000)."
                                },
                                InitialCode = "using System;\nusing System.Threading;\nusing System.Threading.Tasks;\n\nnamespace HelperPlatform\n{\n    class Program\n    {\n        public static int counter = 0;\n        \n        static void Main(string[] args)\n        {\n            // Напишіть Parallel.For для збільшення лічильника 1000 разів:\n            \n            Console.WriteLine(\"Counter: \" + counter);\n        }\n    }\n}",
                                ReferenceCode = "using System;\nusing System.Threading;\nusing System.Threading.Tasks;\n\nnamespace HelperPlatform\n{\n    class Program\n    {\n        public static int counter = 0;\n        \n        static void Main(string[] args)\n        {\n            Parallel.For(0, 1000, i => \n            {\n                Interlocked.Increment(ref counter);\n            });\n            \n            Console.WriteLine(\"Counter: \" + counter);\n        }\n    }\n}"
                            },
                            new CourseTask
                            {
                                Id = 14,
                                Title = "Завдання 2: Паралельний обхід Parallel.ForEach",
                                Description = "Використайте Parallel.ForEach для паралельного піднесення чисел до квадрата.",
                                Instructions = new List<string>
                                {
                                    "Оголосіть список цілих чисел `List<int> numbers = new() { 1, 2, 3 };`.",
                                    "За допомогою `Parallel.ForEach` пройдіться по кожному числу списку.",
                                    "Для кожного елементу виведіть у консоль повідомлення у точному форматі: `Square: [квадрат]` (наприклад, для 3 виведе `Square: 9`)."
                                },
                                InitialCode = "using System;\nusing System.Collections.Generic;\nusing System.Threading.Tasks;\n\nnamespace HelperPlatform\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            // Створіть список {1, 2, 3} та запустіть Parallel.ForEach:\n            \n        }\n    }\n}",
                                ReferenceCode = "using System;\nusing System.Collections.Generic;\nusing System.Threading.Tasks;\n\nnamespace HelperPlatform\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            List<int> numbers = new() { 1, 2, 3 };\n            Parallel.ForEach(numbers, num => \n            {\n                Console.WriteLine(\"Square: \" + (num * num));\n            });\n        }\n    }\n}"
                            }
                        }
                    }
                };

                context.Modules.AddRange(modules);
                context.SaveChanges();
            }
        }
    }
}
