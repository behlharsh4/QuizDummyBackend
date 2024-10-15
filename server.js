const User = require('./models/User');

// Create a new user
app.post('/users', async (req, res) => {
   const { email, fullName, class: userClass } = req.body;

   try {
      const user = new User({ email, fullName, class: userClass });
      await user.save();
      res.status(201).json({ message: 'User created successfully', user });
   } catch (error) {
      if (error.code === 11000) {
         return res.status(400).json({ message: 'Email already exists' });
      }
      res.status(500).json({ message: 'Server error', error });
   }
});

// Get user by email
app.get('/users/:email', async (req, res) => {
   const email = req.params.email;

   try {
      const user = await User.findOne({ email });
      if (!user) {
         return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
   } catch (error) {
      res.status(500).json({ message: 'Server error', error });
   }
});

// Update answers for a user
app.put('/users/:email/answers', async (req, res) => {
   const email = req.params.email;
   const { english, reasoning, science, maths } = req.body;

   try {
      const user = await User.findOneAndUpdate(
         { email },
         { 
            $set: {
               'answers.english': english || [],
               'answers.reasoning': reasoning || [],
               'answers.science': science || [],
               'answers.maths': maths || []
            }
         },
         { new: true }
      );

      if (!user) {
         return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'Answers updated successfully', user });
   } catch (error) {
      res.status(500).json({ message: 'Server error', error });
   }
});

